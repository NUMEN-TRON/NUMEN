import Vue from 'vue'
import {
    Button,
    Popup,
    Icon,
    Cell,
    CellGroup,
    Radio,
    RadioGroup,
    Popover,
    CountDown,
    Overlay,
    Tab,
    Tabs,
    Slider,
    // Circle,
    // CountDown,
    // Progress,
    // Pagination,
    // PasswordInput,
    // NumberKeyboard,
    Loading,
    List,
    NoticeBar,
    // Swipe,
    // SwipeItem,

    Lazyload,
    Toast,
    Dialog,
} from 'vant'

const VANTModule = {
    Button,
    Popup,
    Icon,
    Cell,
    CellGroup,
    Radio,
    RadioGroup,
    Popover,
    CountDown,
    Overlay,
    Tab,
    Tabs,
    Slider,
    // Circle,
    // CountDown,
    // Progress,
    // Pagination,
    // PasswordInput,
    // NumberKeyboard,
    Loading,
    List,
    NoticeBar,
    // Swipe,
    // SwipeItem,

    Lazyload,
    Toast,
    Dialog,
};

Toast.setDefaultOptions('loading', {
    forbidClick: true,
    duration: 12000
});

Object.keys(VANTModule).forEach(key => {
    Vue.use(VANTModule[key]);
});
