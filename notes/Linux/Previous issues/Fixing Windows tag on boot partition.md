`sudo fdisk -l` = List the partition tables for the specified devices and then exit.
https://man7.org/linux/man-pages/man8/fdisk.8.html

Output:
```
Device           Start        End    Sectors   Size Type
/dev/nvme0n1p1    2048       4095       2048     1M BIOS boot            
/dev/nvme0n1p2    4096    3125247    3121152   1.5G Linux filesystem     
/dev/nvme0n1p3 4198400 2000406527 1996208128 951.9G Linux filesystem     
/dev/nvme0n1p4 3125248    4173823    1048576   512M Microsoft basic data 
```

`nvme0n1p2` is mounted on `boot`:
```
mihaiac@Phezzan:~$ mount | grep /dev/nvme0n1p  
/dev/nvme0n1p2 on /boot type ext4 (rw,relatime)
```

Block device attributes:
```bash
mihaiac@Phezzan:~$ sudo blkid /dev/nvme0n1p4
/dev/nvme0n1p4: UUID="..." BLOCK_SIZE="512" TYPE="vfat" PARTLABEL="EFI" PARTUUID="..."
```

ESP = "EFI system partition", 100-500MB that is "essential for booting computers", whatever that means.

In Linux, `/boot/efi` is the standard mount point for the EFI system partition.
Confusingly, GRUB seems to work even though `/boot/efi` isn't configured properly.
`fwupd` somehow needs `/boot/efi`

Added an entry to `etc/fstab`: `UUID=####-#### /boot/efi vfat defaults 0 0`, used the UUID of the nvme0n1p4 partition.

`sudo systemctl daemon-reload`
`sudo mount -a`

```bash
mihaiac@Phezzan:~$ sudo fwupdmgr refresh
WARNING: UEFI ESP partition may not be set up correctly
See https://github.com/fwupd/fwupd/wiki/PluginFlag:esp-not-valid for more information.
Metadata is up to date; use --force to refresh again.
```

https://github.com/fwupd/fwupd/wiki/LVFS-Triaged-Issue:-Invalid-ESP-Partition

Ran  `sudo parted /dev/nvme0n1` ->  `set 4 esp on`