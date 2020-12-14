//引用文件系统模块
var fs = require("fs");
//引用imageinfo模块
var image = require("imageinfo");

function readFileList(path, filesList) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            //递归读取文件
            readFileList(path + itm + "/", filesList)
        } else {
            var obj = {}; //定义一个对象存放文件的路径和名字
            obj.path = path; //路径
            obj.filename = itm //名字
            filesList.push(obj);
        }
    })

}
var getFiles = {
    //获取文件夹下的所有文件
    getFileList: function (path) {
        var filesList = [];
        readFileList(path, filesList);
        return filesList;
    },
    //获取文件夹下的所有图片
    getImageFiles: function (path) {
        var imageList = [];
        this.getFileList(path).forEach((item) => {
            var ms = image(fs.readFileSync(item.path + item.filename));
            ms.mimeType && (imageList.push(item.filename))
        });
        return imageList;

    }, //获取文件夹下所有非图片的文件 2018年8月18日 19:15:13更新
    getTxtList: function (path) {
        return this.getFileList(path).filter((item) => {
            var ms = image(fs.readFileSync(item.path + item.filename));
            return !ms.mimeType
        });

    }
};

//获取文件夹下的所有图片
// let imgs1 = getFiles.getImageFiles("./imgs/");
//获取文件夹下的所有文件
let imgs2 = getFiles.getFileList("./imgs/");
// console.log(imgs1, imgs2)
let str = ''
imgs2.forEach((e, i, arr) => {
    let src = e.path + e.filename;
    str += src + (i == arr.length - 1 ? '' : ',')
})
let arr = str.split(',')
console.log(arr)
fs.writeFile('./js/json.js', 'let arr = ' + JSON.stringify(arr), err => {
    if (err) {
        console.error(err)
        return
    } else {
        console.log('写入成功', str)
    }
    //文件写入成功。
})