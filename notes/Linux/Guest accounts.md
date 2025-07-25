Problem: need to create guest account so PC technician can check whether he correctly put the laptop back together.

### User management
`sudo adduser -m guest`: add "guest " account;
`sudo passwd guest`: set password for the guest account;
`sudo chmod o-rx /home/your-username`: Prevent others from accessing our home directory;
`sudo userdel -r guest`: Delete the guest account when done.

### Adding password for the LUKS-encrypted HDD
`sudo cryptsetup luksAddKey /dev/nvme0n1p3`: set key for the hdd;
`sudo cryptsetup luksRemoveKey /dev/nvme0n1p3`: delete it when done;