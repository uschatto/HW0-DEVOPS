const got = require("got");
const chalk = require("chalk");
const os = require("os");
var config = {};
config.token = process.env.DIGITALOCEANTOKEN;

if ( !config.token)
{
	console.log(chalk`{red.bold DIGITALOCEANTOKEN is not defined!}`);
	console.log(`Please set your environment variables with appropriate token.`);
	console.log(chalk`{italic You may need to refresh your shell in order for your changes to take place.}`);
	process.exit(1);
}

var headers = 
{
	'Content-Type' : 'application/json',
	Authorization : 'Bearer ' + config.token
};

class DigitalOceanProvider
{
        async SSHKeyID()
	{
		let response = await got('https://api.digitalocean.com/v2/account/keys', {headers: headers}).catch(err => console.error(`SSHKeyID ${err}`));
		if (!response) return;
		var obj = JSON.parse(response.body);
		if (obj.ssh_keys)
		{
			for( let ssh_key of obj.ssh_keys)
			{
				console.log(chalk.green(`SSHKeyID to be used : [${ssh_key.name}:${ssh_key.id}]`));
				return ssh_key.id;
			}
		}
		else
		{
			console.log(chalk`{red.bold Could not retrieve ssh key id. Cannot Proceed}`);
			process.exit(1);
		}
	}

	async createVM (dropletName, region, imageName, sshKeyID )
	{
		if( dropletName == "" || region == "" || imageName == "" )
		{
			console.log( chalk.red("You must provide non-empty parameters for createDroplet!") );
			return;
		}
		
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			"ssh_keys":[sshKeyID],
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};
		
		let response = await got.post("https://api.digitalocean.com/v2/droplets",
		{
			headers:headers,
			body: JSON.stringify(data)
		}).catch( err =>
			console.error(chalk.red(`createVM: ${err}`)) 
		); 
		
		if( !response ) return;
		console.log(response.body);
		if(response.statusCode == 202)
		{
			var obj = JSON.parse(response.body);
			console.log(chalk.green(`Created droplet id ${obj.droplet.id}`));
			return obj.droplet.id;
		}
	}
	
	async getIPAddress(dropletID)
	{
		if( typeof dropletID != "number" )
		{
			console.log( chalk.red("You must provide an integer id for your droplet!") );
			return;
		}
		
		let response = await got('https://api.digitalocean.com/v2/droplets/' + dropletID, { headers: headers})
							.catch(err => console.error(`getIPAddress ${err}`));
		if(!response) return;

		var obj = JSON.parse(response.body);
		if(obj.droplet)
		{
			for ( let v4 of obj.droplet.networks.v4)
			{
				console.log(chalk.green(`IP Address of droplet id ${dropletID} is ${v4.ip_address}`));
			}
		}
	}
};

async function provision()
{
	let client = new DigitalOceanProvider();

	//Retrieve a ssh key id
	var sshKeyID = await client.SSHKeyID();

	//Create a new droplet
	var name = "uschatto"+os.hostname();
	var region = "nyc3";
	var image = "centos-6-x64";
	var dropletID = await client.createVM(name,region,image,sshKeyID);

	//Retrieve IP adress
	await client.getIPAddress(dropletID);
}

(async () => {
	await provision();
})();
