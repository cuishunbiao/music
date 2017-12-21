<template>
    <div id="app" @touchmove.prevent>
        <header-box></header-box>
        <tabs></tabs>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script type="text/ecmascript-6">
    import headerBox from 'components/header-box/header-box'
    import tabs from 'components/tabs/tabs'
    import Player from 'components/player/player'

    export default {
        components:{
            headerBox,
            tabs,
            Player
        }
    }
</script>
<style lang="scss" type="text/scss">
    @import "~common/sass/common";
    *{-webkit-box-sizing: border-box;-moz-box-sizing: border-box; box-sizing: border-box;}
    html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,
    small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,
    article,aside,canvas,details,embed,figure,figcaption,footer,header,menu,nav,output,ruby,section,summary,time,mark,audio,video{
        margin: 0; padding: 0; border: 0;}
    article, aside, details, figcaption, figure, footer, header, menu, nav, section { display: block; }
    ul,ol,li{list-style:none;}
    h1,h2,h3,h4,h5,h6{font-size:100%;}
    img,input,select,textarea{vertical-align:middle;border: 0;}
    a{ text-decoration: $none; outline:none; -webkit-tap-highlight-color:transparent; @include transition(all,.2s); }
    a:hover{ text-decoration: $none; color: $color-text; }
    a:focus{ outline:none; }
    html{ -webkit-text-size-adjust:none; overflow-x: hidden; overflow-y: auto; }
    body{ @extend .font-yahei; font-size: .6rem; @include backcolor($color-background); color: $FFF }
    body,html{height: 100%; -webkit-tap-highlight-color: transparent;}
</style>
