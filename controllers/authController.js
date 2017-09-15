const signToken = require("../utils/jwt.js").signToken;
const verifyToken = require("../utils/jwt.js").verifyToken;
const path = require("path");
const bcrypt=require("bcrypt");
const db = require("../utils/db.js");
function isLogin(req, res){
    //取得 header 中 Authorization 的值
    let auth = req.header("Authorization");
    //判定是否有傳入 Authorization
    if(auth !== undefined){
        //將 Authorization 以空白區分
        let arr = auth.split(" ");
        //確認前綴是否為 Bearer
        if(arr[0] === "Bearer"){
            let token = arr[1];
            //驗證token
            verifyToken(token, function(err, decoded){
                //錯誤
                if(err){
                    res.json({
                        login: false
                    });
                }else{
                    res.json({
                        login: true,
                        username: decoded.username
                    });
                }
            });
        }else{
            res.json({
                login: false
            });
        }
    }else{
        res.json({
            login: false
        });
    }
}

function loginHtml(req, res){
    res.sendFile(path.resolve(__dirname, "../views/login.html"));
}


function login(req, res){
    let { username, password } = req.body;
    
    if(username != undefined && password != undefined){
        db.execute(`SELECT password FROM users WHERE username= ? `,
            [ username ],
            function(err, results, fields){
                if(err){
                    console.log(err);
                    res.json({
                        login: false
                    });
                }else{
                    if(results.length == 1){
                        bcrypt.compare(password, results[0].password, function(err, same){
                            if(same){
                                signToken({
                                    username: username
                                }, function(err, token){
                                    res.json({
                                        login: true,
                                        token: token
                                    });
                                })
                            }else{
                                res.json({
                                    login: false
                                });
                            }
                        });
                    }else{
                        res.json({
                            login: false
                        });
                    }
                }
            }
        );
    }else{
        res.json({
            login: true
        });
    }
}

function registerHtml(req,res){
    res.sendFile(path.resolve(__dirname,"../views/register.html"));

}
function register(req, res){
    //取得傳送資料
    let { username, password, confirm } = req.body;
    //判斷密碼是否與確認一致
    if(username != undefined &&
        password != undefined &&
        confirm != undefined &&
        password == confirm ){
        //雜湊密碼
        bcrypt.hash(password, 10, function(err, hash){
            db.execute(
                "INSERT INTO `users`(`username`, `password`) VALUES(?, ?)",
                [username, hash],
                function(err, results, fields){
                    if(err){
                        res.json({
                            register: false
                        });
                    }else{
                        res.json({
                            register: true
                        });
                    }
                }
            );
        })
    }else{
        res.json({
            register: false
        })
    }
}

module.exports = {
    isLogin: isLogin,
    login: login,
    loginHtml: loginHtml,
    registerHtml:registerHtml,
    register:register
}