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
function fileDisplay(filePath) {
    let dirArr = []
    let files = fs.readdirSync(filePath);
    files.forEach(function (filename) {
        var filedir = path.join(filePath, filename);
        let stats = fs.statSync(filedir);
        var isFile = stats.isFile(); //是文件  
        var isDir = stats.isDirectory(); //是文件夹  
        if (isFile) {
            // console.log('是文件：', filedir);
        }
        if (isDir) {
            dirArr.push(filename)
            // console.log('是文件夹：', filename);
            fileDisplay(filedir); //递归，如果是文件夹，就继续遍历该文件夹下面的文件  
        }
    });
    return dirArr;
}
let files = fileDisplay('./imgs/')
console.log('files', files)


//获取文件夹下的所有图片
// let imgs1 = getFiles.getImageFiles("./imgs/");
//获取文件夹下的所有文件
let imgs2 = getFiles.getFileList("./imgs/");
// console.log(imgs1, imgs2)
let joinDataArr = [];


files.forEach(el => {
    let joinDataObj = {
        strArr: [],
        title: ''
    }

    joinDataObj.title = el;
    imgs2.forEach((e, i, arr) => {
        let src = e.path + e.filename;
        if (src.indexOf(joinDataObj.title) != -1) {
            // 是这个类别的
            // let str = '355元-1_奔图（PANTUM）TL-463X黑色粉盒（适用于P3301DN）.jpg';
            let priceInd = e.filename.indexOf('-');
            let nameEndInd = e.filename.lastIndexOf('.')
            let price = e.filename.slice(0, priceInd);
            let name = e.filename.slice(priceInd + 1, nameEndInd)
            console.log('价钱：', price, '名称：', name)
            let imgInfo = {
                price,
                name,
                src,
            }
            joinDataObj.strArr.push(imgInfo);
        }
    })
    // joinDataObj.strArr = str.split(',').filter(e => e !== '')
    joinDataArr.push(joinDataObj)
})
// console.log(joinDataArr)


let writeStr = 'const arr = ' + JSON.stringify(joinDataArr)
fs.writeFile('./js/json.js', writeStr, err => {
    if (err) {
        console.error(err)
        return
    } else {
        console.log('写入成功', writeStr)
    }
})


/**
 * 最后组成数据格式：
 [
   {
    title: '类型1',
    arr: ['./imgs/xx.png', './imgs/xx.png']
    },
    {
    title: '类型1',
    arr: ['./imgs/xx.png', './imgs/xx.png']
    }
 ]

 改为

 [{
  title: '类型',
  arr: [
     {
       price: '360元',
       name: '我是名称'
       src: 'xxx.jpg'
     }
  ]
 },{
     title: '类型',
     arr: [{
         price: '360元',
         name: '我是名称'
         src: 'xxx.jpg'
     }]
 }]

 * 
 */