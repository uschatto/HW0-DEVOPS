# HW0-Provision

**Basic Course Setup**
> *Moodle - Profile picture has been uploaded to the mentioned website adhering to the guidelines.*

> *Mattermost - Full name has been set in the profile settings alone with a profile picture.*

> *Stack Overflow - An account has been setup.*

**Github**
> *A private repo has been created and the instructor and 2 TAs have been added as collaborators.*

[**Asking a question**](https://stackoverflow.com/c/ncsu/questions/1197)

[**Answering a question**](https://stackoverflow.com/c/ncsu/questions/1159/1198#1198)

**Opunit checks**
<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/87ae8100-35b3-11ea-8d2e-1ec9a25623c9" width="500" height="600">
</p>

**Provisioning**

The cloud providers used for this assignment are as follows:

## [Digital Ocean](https://www.digitalocean.com/)

- To use DigitalOcean you can first `cd DigitalOcean` and then `npm install` to install the dependencies and set-up a preliminary environment.

- Once you have setup your account on Digital Ocean website you would need to generate a token which would be further used to authorize
the HTTP requests.
<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/cf3b6100-3955-11ea-99ee-a4661993d222" width="700" height="250">
</p>

- Once you have generated the token, the next step is to set the token in an environment variable "DIGITALOCEANTOKEN" to be used by 
the program. You can use the following command (this would change depending on your OS) to do so.

```
export DIGITALOCEANTOKEN=xxxxxxxxxxxxxxxxxxx
```

- Setting up SSH keys:
  - Create a new SSH Keys pair (public and private) using `ssh-keygen -t rsa` in your host machine.
  - To register the public key with Digital Ocean, a POST request needs to be made with the following command.
  
```
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <DIGITAL OCEAN TOKEN>" -d '{"name":"Digital Ocean","public_key":"<PUBLIC KEY GENERATED IN THE ABOVE STEP>"}' "https://api.digitalocean.com/v2/account/keys"
```

<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/b08a9980-3958-11ea-9334-5fdac2b00178" width="600" height="150">
</p>
 
 - The provision code provided reads the DIGITALOCEANTOKEN and send a HTTP GET request to retrieve the ssh key ID. Once it receives the key id it moves on to create a new VM or in terms of Digital Ocean a new droplet is created by setting `"ssh_keys":[sshKeyID]` in the body and making a HTTP POST request. We extract the droplet ID from the response received. Using this droplet ID we are able to make another HTTP GET request to retrieve the information about the droplet thus created. Here we extract the IP address.

<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/39a3cf80-395d-11ea-9036-90e4b8323672" width="900" height="200">
</p>

## [Amazon Web Services](https://aws.amazon.com/)

- To use AWS you can first `cd AWS` and then `npm install` to install the dependencies and set-up a preliminary environment.
- Once you have setup your account on AWS website you would need to generate access keys (Access key ID and secret access key) which would be further used to authorize the HTTP requests. 
<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/a6bc6280-3967-11ea-9009-7dc783306b37" width="600" height="200">
</p>

- These keys need to be stored in a file called "credentials" which would be read by aws-sdk module in the program. Store this file in /home/<USER_NAME>/.aws folder. This directory would change depending on your OS. The contents of the file is as follows :

```
[default]
aws_access_key_id = AWS ACCESS KEY ID
aws_secret_access_key = AWS SECRET ACCESS KEY
```

- Create a new Security Group for the EC2 instance and give the inbound ip address to accept the SSH connections from your specified hosts. Here, 0.0.0.0/0 ip is defined to accept the SSH connection from all hosts.

<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/da4cbc00-396a-11ea-983d-133ed1e395fc" width="500 height="400">
</p>

- Create a new Key Pair for the EC2 instance and store the private key (.pem) generated on your local host to use it to ssh.

<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/e89ad800-396a-11ea-9998-b7df9c9699ee" width="600" height="200">
</p>

- The provision code provided reads the credentials file and sets the above generated key pair name and security group id in the parameters. It then moves on to create a new VM or in terms of AWS a new EC2 instance is created. We extract the instance ID from the response received. Using this instance ID we are able to issue another call to retrieve the information about the instance thus created. Here we extract the IP address.

<p align="center"> 
<img src="https://media.github.ncsu.edu/user/12214/files/4976e000-396c-11ea-90bf-8b7b3c230656" width="700" height="100">
</p>
