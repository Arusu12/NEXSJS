const layouts = 
[
    { 
        name: 'main', 
        code: `
            <div class="main">
                <div class="navbar"></div>
                <div class="chat-container"></div>
            </div>`
    },
    { 
        name: '404', 
        code: `
            <div class="main">
                <div class="navbar"></div>
                <div class="block-404"></div>
            </div>`
    }
]
const pages = 
[
    { link:'/NEXSJS/', layout:'main', block:'home', type:'static' },
    { link:'/NEXSJS/ws', layout:'main', block:'ws', type:'static' },
    { link:'/NEXSJS/popup', layout:'main', block:'popup', type:'popup' },
    { link:'/NEXSJS/js', layout:'main', block:'home', type:'func', func:"renderStory(app.sections.get('content'))"},
    { link:'/NEXSJS/404', layout:'main', block:'404', type:'static' }
]

const blocks =
[
    {
        name:'navbar',
        code:`
            <div class="nav">
                <div class="e nav-back" onclick="app.helper.goBack()"><</div>
                <div class="e appName">NEXSJS Example</div>
            </div>`
    },
    {
        name:'home',
        code:`
        <img src="@{{user.pfp}}" class="userPFP">
            <h2>Hello @{{user.name}}!</h2>
            <span style="text-align:center;">There is currently nothing here, but the adventure to build a useful framework goes on!</span>
        `
    },
    {
        name:'404',
        code:`
            <div class="block-404">
                <h1>404</h1>
                <span>Seems like you wandered into an empty space...</span>
            </div>`
    }
]

export { layouts, pages, blocks }