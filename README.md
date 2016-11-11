# Deepshare Website

## To upload sdk file to azure storage

First, you need make sure azure command line tools was installed on your laptop, and you imported azure account already. If not, please refer to [microsoft website](https://azure.microsoft.com/en-us/documentation/articles/xplat-cli-install/) to get it installed.

sdk is stored in storage account(deepshare) in the container(sdk), you can easily upload file using `azure storage blob upload` into the azure storage.

please contact infra admin for storage key to do the uploading.

## To Update Website
```
ssh dsadmin@qd.chinacloudapp.cn
cd installation/cn-flannel-azure/
ssh -F  ./output/k8s-fl_2b56b83f47ef6c_ssh_conf node-07
cd /mnt/resource/nfs/deepshare_website/
git pull origin master
```
## To restart website

Sometimes, we need restart website due to modifying the config of Jekyll, in case of you did not see website been updated, please consider to restart website.

Firstly, you should exit from node-07 and login to master-00 by `ssh -F  ./output/k8s-fl_2b56b83f47ef6c_ssh_conf master-00`, and then you can get all running pods by `kubectl get po`. There should be a pod which's name starting with `deepshare-website`, please copy the pod name, and `kubectl stop pod <pod-name>`, the existing pod will be deleted, and a new pod starting with `deepshare-website` will be started.

We have to wait for a few minutes util see the new pod is running by `kubectl get po|grep website`, now website should have been updated. 

