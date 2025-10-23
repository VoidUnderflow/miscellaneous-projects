Issue: when I installed Ubuntu from the live USB, legacy mode was selected in BIOS, which apparently makes Ubuntu itself get installed in legacy mode. 

This led to a weird issue when booting, where the PxE would be the first (and only) UEFI boot option, and I had to dismiss PxE through IPv4 and IPv6, before the boot loader would search the SSD for something else. This was annoying. Disabling PxE led to the OS not being able to boot at all (yay!).

So, I had to chunk out partition 2 and create a UEFI partition from it.

First, make sure the USB is actually seen when disabling legacy mode in BIOS' boot settings.

Boot Live USB, open terminal, run `sudo gparted`.

Right-click on nvme0n1p2 (the 2GB `/boot` partition), choose Resize/Move.

Shrink it from 2048 MiB down to ~1500 MiB

You’ll get about 524 MiB free space before or after — it’s best to leave it _after_ the shrunken partition to keep layout safe.

Click Apply and wait.

Now in that free space, right-click > New.

Create a 512 MiB partition, format it FAT32.

Set flags on that new partition: `boot` and `esp`.

Apply changes.

Format the new EFI partition as FAT32.
`sudo mkfs.vfat -F32 /dev/nvme0n1p4`

Unlock your LUKS encrypted partition and activate LVM
```
sudo cryptsetup luksOpen /dev/nvme0n1p3 cryptroot
sudo vgchange -ay
```

Mount your root filesystem and boot partition
```
sudo mount /dev/ubuntu--vg-ubuntu--lv /mnt
sudo mount /dev/nvme0n1p2 /mnt/boot
```

Mount your freshly formatted EFI partition
```
sudo mkdir -p /mnt/boot/efi
sudo mount /dev/nvme0n1p4 /mnt/boot/efi
```

Bind mount system directories and chroot
```
for i in /dev /dev/pts /proc /sys /run; do sudo mount --bind $i /mnt$i; done
sudo chroot /mnt
```
Install UEFI bootloader (GRUB)
```
apt update
apt install --yes grub-efi-amd64-signed shim-signed
mount -t efivarfs efivarfs /sys/firmware/efi/efivars
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=ubuntu
update-grub
exit
```
Unmount whatever's left mounted
```
sudo umount /mnt/boot/efi
sudo umount /mnt/boot
sudo umount /mnt/dev/pts  
sudo umount /mnt/dev  
sudo umount /mnt/proc  
sudo umount /mnt/sys  
sudo umount /mnt/run  
sudo umount /mnt/boot/efi  
sudo umount /mnt/boot
sudo umount /mnt
```
Close encrypted volume
`sudo cryptsetup luksClose cryptroot`

Reboot, should work.

Next time, make sure you properly install the UEFI partition. Now I got a leftover 1MiB legacy partition and a 12MiB buffer partition between the UEFI and the encrypted partitions.