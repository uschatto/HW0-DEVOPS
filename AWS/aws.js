var AWS = require("aws-sdk");
const chalk = require("chalk");
const fs = require("fs");

//Setting the region for the EC2 instance
AWS.config.update({region: 'us-east-2'});

var ec2 = new AWS.EC2();

//For Windows this would look for the "credentials" file in C:\Users\<USER_NAME>\.aws\credentials
//For Linux this would look for the "credentials" file in ~/.aws/credentials
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

//Setting the parameters for creating an EC2 instance 
var params = {
    ImageId: "ami-965e6bf3", 
    InstanceType: "t2.micro",  
    MaxCount: 1, 
    MinCount: 1,
    KeyName: "HW0-DevOps",
    SecurityGroupIds: ["sg-01737c49d41b579ed"]
   };

ec2.runInstances(params, function(err, data) {
     if (err) console.log(err, err.stack); 
        console.log(chalk.green(`AWS EC2 instance created with Instance ID: ${data.Instances[0].InstanceId}`));   
        var paramsPassed = {
            InstanceIds: [
                data.Instances[0].InstanceId
            ]
        };
	setTimeout(function() {
     		ec2.describeInstances(paramsPassed, function(err, data) {
            		if (err) console.log(chalk`{red.bold Could not extract IP address}`);
            		else     console.log(chalk.green(`The IP address of the instance is ${data.Reservations[0].Instances[0].PublicIpAddress}`));
          	});
     }, 20000);
});
