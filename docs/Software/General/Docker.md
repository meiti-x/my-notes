understand that running state of container is directly tied to state of single running program inside container. if a program is running, the container running. if the programmed stopped, the container is stopped. restarting a container will run program again

---
historically, UNIX-style operatimg system have used the term jail to describe a modified runtime environment that limits the scope of resources that a jailed program can access

---
virtual machine can perform optimally once everything is up and running, but the startup delay make them a poor fit for just-in-time or reactive deployment scenarios.

---
docker uses linux name-space and cgroups.

---
notice that CLI interface runs in what is called user space memory, just like other programs, just like other programs that run on top of OS. ideally, programs running in user space can't modify kernel space ([[User space vs kernel space]]) memory. OS is interface between all user programs and hardware that the computer is running on

---

