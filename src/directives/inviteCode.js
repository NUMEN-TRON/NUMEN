import Store from '../store/index'

const inviteCode = {
    bind(el, binding, vnode) {
        el.onclick = function (event) {
            event.stopPropagation();
            if (vnode.context.$store.state.token) {
                binding.expression && binding.value();
            } else {
                Store.commit('SET_REGISTER_INVITE_DLG', true);
            }
        }
    }
};

export default inviteCode
