const path = require('path');
const fs = require("fs");
const image = require("imageinfo");

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

/** 
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径 
 */

let arr = [{
        title: '类型名称',
        imgs: [{
                price: '360元',
                name: '我是名称',
                src: 'xxx.jpg'
            },
            {
                price: '360元',
                name: '我是名称',
                src: 'xxx.jpg'
            }
        ]
    },
    {
        title: '类型名称',
        imgs: [{
            price: '360元',
            name: '我是名称',
            src: 'xxx.jpg'
        }],
        child: {
            title: '类型名称',
            imgs: [{
                price: '360元',
                name: '我是名称',
                src: 'xxx.jpg'
            }],
            child: {}
        }
    }
]

let dirArr = [];

function fileDisplay(filePath) {
    let isRoot = filePath !== './imgs/'
    let pathName = filePath.split(path.sep)
    let obj;
    if (isRoot) {
        obj = {
            id: Math.random().toString(36).substr(2),
            title: pathName[pathName.length - 1],
            imgs: [],
            child: []
        }
    } else {
        obj = []
    }
    let files = fs.readdirSync(filePath);
    files.forEach(function (filename) {
        let filedir = path.join(filePath, filename);
        let stats = fs.statSync(filedir);
        let isFile = stats.isFile();
        let isDir = stats.isDirectory();
        //是文件
        if (isFile && isRoot) {
            // push imgs
            let priceInd = filename.indexOf('-');
            let nameEndInd = filename.lastIndexOf('.')
            let price = filename.slice(0, priceInd);
            let name = filename.slice(priceInd + 1, nameEndInd)
            let src = './' + filedir.replace(/\\/g, "/");
            obj.imgs.push({
                price,
                name,
                src
            })
        }
        //是文件夹
        if (isDir) {
            // push child
            console.log(filedir)
            isRoot ? obj.child.push(fileDisplay(filedir)) : obj.push(fileDisplay(filedir))
            //递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
    return obj
}
// 返回一个 child obj
dirArr.push(fileDisplay('./imgs/'));
// console.log('files', dirArr)


//获取文件夹下的所有图片
// let imgs1 = getFiles.getImageFiles("./imgs/");
//获取文件夹下的所有文件
// let imgs2 = getFiles.getFileList("./imgs/");
// console.log(imgs1)
// let joinDataArr = [];



let writeStr = 'const arr = ' + JSON.stringify(dirArr)
fs.writeFile('./js/json.js', writeStr, err => {
    if (err) {
        console.error(err)
        return
    } else {
        console.log('写入成功')
    }
})