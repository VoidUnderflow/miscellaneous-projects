Previously, this was solved by switching to Wayland + relogging + switching power mode to high performance.

`echo $XDG_SESSION_TYPE` = check what session we're running;

`prime-select query` => `on-demand` = some Intel - Nvidia clash again?
`sudo prime-select nvidia` + reboot => still not fixed, but now `prime-select query` shows Nvidia.

`xrandr --listmonitors` -> laptop monitor :(

`nvidia-smi` => 
NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver. Make sure that the latest NVIDIA driver is installed and running.

These magic incantations did it!
```
sudo apt install --reinstall nvidia-driver-580-open
sudo apt install linux-headers-$(uname -r) dkms
echo "options nvidia-drm modeset=1" | sudo tee /etc/modprobe.d/nvidia.conf
sudo update-initramfs -u
sudo reboot
```

Reinstall driver -> install linux-headers + dkms to make sure the Nvidia module automatically rebuilds when the kernel updates -> Load Nvidia DRM with "modeset" enabled (GPU can control displays directly) -> rebuild `initramfs` = mini fs that gets booted before root fs mounts (includes kernel modules + early drivers);

```
sudo prime-select on-demand
sudo reboot
```
Nvidia instead of on-demand was a bit laggy.