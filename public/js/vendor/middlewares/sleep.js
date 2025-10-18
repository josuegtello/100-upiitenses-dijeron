const sleep=function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default sleep