process.env.port = process.env.PORT || 3333;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urldb;

if(process.env.NODE_ENV === 'dev'){
    urldb = 'mongodb://localhost:27017/test';
}else{
    urldb = 'mongodb+srv://giovanny:nigro12345@cluster0-wavfn.mongodb.net/test?retryWrites=true';
}

process.env.urldb = urldb;