# 🦿cognito-user-export🦿

AWS Cognito のユーザープールに存在するユーザー情報を CSV で取得するスクリプトです。

## プロジェクト上でパッケージをインストールします
```
$ npm install
```

## .env ファイルを作成し、必要な情報を入れます

```.env
AWS_REGION = ap-northeast-1
USER_POOL_ID = ap-northeast-1_xxxxxx
AWS_ACCESS_KEY_ID = xxxxxxx
AWS_AWS_SECRET_ACCESS_KEY = xxxxxxx
```

## 実行

```
$ node script.js
```
