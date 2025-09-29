Previously, this was solved by switching to Wayland + relogging + switching power mode to high performance.

`echo $XDG_SESSION_TYPE` = check what session we're running;

`prime-select query` => `on-demand` = some Intel - Nvidia clash again?
`sudo prime-select nvidia` + reboot => still not fixed, but now `prime-select query` shows Nvidia.

`xrandr --listmonitors` -> laptop monitor :(

`nvidia-smi` => 
NVIDIA-SMI has failed because it couldn't communicate with the NVIDIA driver. Make sure that the latest NVIDIA driver is installed and running.

