import ajax from './ajax'
//服务器地址
const BASE_URL = ''

// post - 注册接口
export const POST_REGISTER = (nickname, phone, password, cipher) => ajax(BASE_URL + '/user/register', {
    nickname,
    phone,
    password,
    cipher
}, 'post')

// post - 登录接口
export const POST_LOGIN1 = (phone, password, login_type) => ajax(BASE_URL + '/user/login', {
    phone,
    password,
    login_type
}, 'post')

export const POST_LOGIN2 = (phone, cipher, login_type) => ajax(BASE_URL + '/user/login', {
        phone,
        cipher,
        login_type
    }, 'post')
    //post - 发送验证码
export const SEND_CIPHER = (phone) => ajax(BASE_URL + '/user/send', {
    phone
}, 'post')

// get - 退出登录接口
export const GET_EXIT = (token) => ajax(BASE_URL + '/user/exit', {
    token
})

// post - 修改密码接口
export const POST_MODIFY_PASSWORD = (phone, password) => ajax(BASE_URL + '/user/modifypassword', {
    phone,
    password
}, 'post')


// 我的 - get - 首页
export const GET_MY_INDEX = (token) => ajax(BASE_URL + '/my/index', {
    token
})

// 我的 - get - 个人资料
export const GET_MY_INFORMATION = (token) => ajax(BASE_URL + '/my/information', {
    token
})

// 我的 - post - 个人资料
export const POST_MY_INFORMATION = (user_id, avatar, nickname, gender, birthday, bio, folder) => ajax(BASE_URL + '/my/information', {
    user_id,
    avatar,
    nickname,
    gender,
    birthday,
    bio,
    folder
}, 'post')


// 我的 - get - 我的问题
export const GET_MY_QUESTION = (page) => ajax(BASE_URL + '/my/question', {
    page
})


// 我的 - get - 我的评论
export const GET_MY_ANSWER = (page) => ajax(BASE_URL + '/my/answer', {
    page
})

// 我的 - get - 我的发布
export const GET_MY_PUBLISH = (page) => ajax(BASE_URL + '/my/work', {
    page
})

//我的 - get - 删除问题
export const DELETE_QUESTION = (question_id) => ajax(BASE_URL + '/my/delete_question', {
    question_id
})

//我的 - get - 删除发布作品
export const DELETE_PUBLISH = (work_id) => ajax(BASE_URL + '/my/delete_work', {
    work_id
})

// 我的 相关接口 end -------------------------------------------------------------------------------------------




// 问答 相关接口 start -------------------------------------------------------------------------------------------

// 问答 - get - 获取问答分类接口
export const GET_ASK_CATEGORY = () => ajax(BASE_URL + '/ask/category')

// 问答 - post - 发表问题接口
export const POST_ASK_PUBLISH = (img_arr, title, description, folder) => ajax(BASE_URL + '/ask/publish', {
    img_arr,
    title,
    description,
    folder
}, 'post')

//问答 - 首页根据不同的状态获取问题 - get 
export const GET_ASK_QUESTION = (page, state) => ajax(BASE_URL + '/ask/question', {
    page,
    state
})

// 问答 - get - 查看问题详情接口
export const GET_ASK_DETAIL = (question_id) => ajax(BASE_URL + '/ask/detail', {
    question_id
})

//问答 - post - 回答问题接口
export const POST_ASK_ANSWER = (question_id, content) => ajax(BASE_URL + '/ask/answer', {
    question_id,
    content
}, 'post')

//问答 - post - 修改问题接口
export const POST_ASK_MODIFYQUES = (question_id, title, description, img_arr, folder) => ajax(BASE_URL + '/ask/modify_ques', {
    question_id,
    title,
    description,
    img_arr,
    folder
}, 'post')

//问答 - post - 修改评论接口
export const POST_ASK_MODIFYANSWER = (answer_id, content) => ajax(BASE_URL + '/ask/modify_answer', {
    answer_id,
    content
}, 'post')

//问答 - get - 采纳回答接口
export const GET_ASK_ADOPT = (answer_id, question_id) => ajax(BASE_URL + '/ask/adopt', {
    answer_id,
    question_id
})

//问答 - post - 评论接口
export const POST_ASK_REPLY = (answer_id, reply_content) => ajax(BASE_URL + '/ask/reply', {
    answer_id,
    reply_content
}, 'post')

//问答 - post - 查看数量 +1 接口
export const POST_ASK_WATCHNUM = (question_id) => ajax(BASE_URL + '/ask/watchnum', {
    question_id
}, 'post')

//问答 - get - 获取分类下的问题 接口
export const GET_ASK_QEUSBYCATE = (cate_id, state, page) => ajax(BASE_URL + '/ask/quesbycate', {
        cate_id,
        state,
        page
    })
    //问答 - 搜索接口
export const GET_SEARCH = (title) => ajax(BASE_URL + '/ask/search', {
    title
})

// 问答 相关接口 end -------------------------------------------------------------------------------------------




//  发布相关接口 start -------------------------------------------------------------------------------------------

// 发布 - post - 发布作品接口
export const POST_WORK_PUBLISH = (cate_id, img_arr, title, description, folder) => ajax(BASE_URL + '/work/publish', {
    cate_id,
    img_arr,
    title,
    description,
    folder
}, 'post')

//   发布 - get - 查看作品详情接口
export const GET_WORK_DETAIL = (work_id) => ajax(BASE_URL + '/work/detail', {
    work_id
})

//  发布 -  post - 评论接口
export const POST_WORK_ANSWER = (work_id, content) => ajax(BASE_URL + '/work/answer', {
    work_id,
    content
}, 'post')

//  发布 -  post - 修改作品接口
export const POST_WORK_MODIFYQUES = (work_id, title, description, img_arr, folder) => ajax(BASE_URL + '/work/modify_works', {
    work_id,
    title,
    description,
    img_arr,
    folder
}, 'post')

//  发布 -  post - 修改评论接口
export const POST_WORK_MODIFYANSWER = (answer_id, content) => ajax(BASE_URL + '/work/modify_answer', {
    answer_id,
    content
}, 'post')

//  发布 -  get - 采纳评论接口
export const GET_WORK_ADOPT = (answer_id, work_id) => ajax(BASE_URL + '/work/adopt', {
    answer_id,
    work_id
})

// 发布 -  post - 评论接口
export const POST_WORK_REPLY = (answer_id, reply_content) => ajax(BASE_URL + '/work/reply', {
    answer_id,
    reply_content
}, 'post')

//  发布 - post - 查看数量 +1 接口
export const POST_WORK_WATCHNUM = (work_id) => ajax(BASE_URL + '/work/watchnum', {
    work_id
}, 'post')

//  发布 - 根据不同的状态获取问题 - get 
export const GET_WORK_QUESTION = (page, state) => ajax(BASE_URL + '/work/works', {
        page,
        state
    })
    //  发布 - 搜索作品
export const GET_SEARCH_WORK = (title) => ajax(BASE_URL + '/work/search', {
    title
})

// 发布 相关接口 end -------------------------------------------------------------------------------------------



export const GET_GOODS_LIST = (page, state) => ajax(BASE_URL + '/shop/goodslist', {
    page,
    state
})

export const GET_GOODS_DETAIL = (goods_id) => ajax(BASE_URL + '/shop/detail', {
    goods_id
})

export const GET_CART_LIST = (goodsId_list) => ajax(BASE_URL + '/shop/cart_list', {
    goodsId_list
})