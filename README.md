# zwavecontroller
Service converting z-wave events to REST

# libopenzwave.so.1.4: cannot open shared object file: No such file or directory 
1. Copy libopenzwave.so.1.4 from the zwave lib build to app folder (root or sub)
2. export LD_LIBRARY_PATH=<path to lib>
3. sudo ldconfig
4. Ref: https://github.com/OpenZWave/node-openzwave-shared/issues/98

# Unable to read serial port /dev/*
1. Add user to dialout group in /etc/group
2. Reboot (or restart getty)
