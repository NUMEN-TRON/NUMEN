
const directives = {};
const contextObj = require.context('.', false, /^(?!.*(index.js$)).*\.js$/);
contextObj.keys().forEach(fileName => {
    const config = contextObj(fileName);
    const name = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '').replace(/([A-Z])/g,"-$1").toLowerCase();
    directives[name] = config.default || config;
});

export default {
    install(Vue) {
        Object.keys(directives).forEach((key) => {
            Vue.directive(key, directives[key])
        });
    },
}
