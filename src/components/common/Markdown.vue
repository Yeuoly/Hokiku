<template>
    <div class="irina-markdown">
        <div v-html="markdowned_html"></div>
    </div>
</template>

<script>
const ShowDown = require('showdown')
const convert = new ShowDown.Converter({
    tables: true,
})

export default {
    props : ['content'],
    data : () => ({
        markdowned_html : '',
    }),
    watch : {
        content :  {
            handler(val) {
                this.markdowned_html = convert.makeHtml(val)
            },
            immediate : true
        }
    }
}
</script>

<style>
.irina-markdown {
    margin: 0 auto;
    font-family: "Microsoft YaHei", arial, sans-serif;
    color: #444444;
    line-height: 1;
    padding: 2px;
}

.irina-markdown h1,
.irina-markdown h2,
.irina-markdown h3,
.irina-markdown h4 {
    color: #111111;
    font-weight: 400;
}

.irina-markdown h1,
.irina-markdown h2,
.irina-markdown h3,
.irina-markdown h4,
.irina-markdown h5 {
    font-family: Georgia, Palatino, serif;
    font-weight: bold;
}

.irina-markdown h1,
.irina-markdown h2,
.irina-markdown h3,
.irina-markdown h4,
.irina-markdown h5,
.irina-markdown p,
.irina-markdown dl {
    margin-bottom: 16px;
    padding: 0;
}

.irina-markdown h1 {
    font-size: 48px;
    line-height: 54px;
}

.irina-markdown h2 {
    font-size: 36px;
    line-height: 42px;
}

.irina-markdown h1,
.irina-markdown h2 {
    border-bottom: 1px solid #EFEAEA;
    padding-bottom: 10px;
}

.irina-markdown h3 {
    font-size: 24px;
    line-height: 30px;
}

.irina-markdown h4 {
    font-size: 21px;
    line-height: 26px;
}

.irina-markdown h5 {
    font-size: 18px;
}

.irina-markdown a {
    color: #0099ff;
    margin: 0;
    padding: 0;
    vertical-align: baseline;
}

.irina-markdown a:hover {
    text-decoration: none;
    color: #ff6600;
}

.irina-markdown a:visited {
    /*color: purple;*/
}

.irina-markdown ul,
.irina-markdown ol {
    padding: 0;
    padding-left: 24px;
    margin: 0 0 0 5px;
    list-style: circle !important;
}

.irina-markdown li {
    line-height: 24px;
    list-style: circle !important;
}

.irina-markdown p,
.irina-markdown ul,
.irina-markdown ol {
    font-size: 16px;
    line-height: 24px;
}

.irina-markdown ol ol,
.irina-markdown ul ol {
    list-style-type: lower-roman;
}

.irina-markdown code {
    font-family: Consolas, Monaco, Andale Mono, monospace;
    line-height: 1.5;
    font-size: 13px;
    border-style: solid;
    border-color: #f88a8a;
    border-width: 1px;
}

.irina-markdown code,
.irina-markdown pre {
    border-radius: 3px;
    background-color: #fdf3b8;
    color: red;
}

.irina-markdown pre {
    margin-top: 10px;
}

.irina-markdown code {
    font-family: Consolas, Monaco, Andale Mono, monospace;
    margin: 0 2px;
}

.irina-markdown pre {
    line-height: 1.7em;
    overflow: auto;
    padding: 6px 10px;
    border-left: 5px solid #6CE26C;
}

.irina-markdown pre > code {
    border: 0;
    display: inline;
    max-width: initial;
    padding: 0;
    margin: 0;
    overflow: initial;
    line-height: inherit;
    font-size: .85em;
    white-space: pre;
    background: 0 0;

}

.irina-markdown code {
    color: #666555;
}


/** markdown preview plus 对于代码块的处理有些问题, 所以使用统一的颜色 */
/*code .keyword {
  color: #8959a8;
}

code .number {
  color: #f5871f;
}

code .comment {
  color: #998
}*/

.irina-markdown aside {
    display: block;
    float: right;
    width: 390px;
}

.irina-markdown blockquote {
    border-left: .5em solid #eee;
    padding: 0 0 0 2em;
    margin-left: 0;
}

.irina-markdown blockquote cite {
    font-size: 14px;
    line-height: 20px;
    color: #bfbfbf;
}

.irina-markdown blockquote cite:before {
    irina-markdown: '\2014 \00A0';
}

.irina-markdown blockquote p {
    color: #666;
}

.irina-markdown hr {
    text-align: left;
    color: #999;
    height: 2px;
    padding: 0;
    margin: 16px 0;
    background-color: #e7e7e7;
    border: 0 none;
}

.irina-markdown dl {
    padding: 0;
}

.irina-markdown dl dt {
    padding: 10px 0;
    margin-top: 16px;
    font-size: 1em;
    font-style: italic;
    font-weight: bold;
}

.irina-markdown dl dd {
    padding: 0 16px;
    margin-bottom: 16px;
}

.irina-markdown dd {
    margin-left: 0;
}

/* Code below this line is copyright Twitter Inc. */

.irina-markdown button,
.irina-markdown input,
.irina-markdown select,
.irina-markdown textarea {
    font-size: 100%;
    margin: 0;
    vertical-align: baseline;
    *vertical-align: middle;
}

.irina-markdown button,
.irina-markdown input {
    line-height: normal;
    *overflow: visible;
}

.irina-markdown button::-moz-focus-inner,
.irina-markdown input::-moz-focus-inner {
    border: 0;
    padding: 0;
}

.irina-markdown button,
.irina-markdown input[type="button"],
.irina-markdown input[type="reset"],
.irina-markdown input[type="submit"] {
    cursor: pointer;
    -webkit-appearance: button;
}

.irina-markdown input[type=checkbox],
.irina-markdown input[type=radio] {
    cursor: pointer;
}

/* override default chrome & firefox settings */
.irina-markdown input:not([type="image"]),
.irina-markdown textarea {
    -webkit-box-sizing: irina-markdown-box;
    -moz-box-sizing: irina-markdown-box;
    box-sizing: irina-markdown-box;
}

.irina-markdown input[type="search"] {
    -webkit-appearance: textfield;
    -webkit-box-sizing: irina-markdown-box;
    -moz-box-sizing: irina-markdown-box;
    box-sizing: irina-markdown-box;
}

.irina-markdown input[type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
}

.irina-markdown label,
.irina-markdown input,
.irina-markdown select,
.irina-markdown textarea {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    font-weight: normal;
    line-height: normal;
    margin-bottom: 18px;
}

.irina-markdown input[type=checkbox],
.irina-markdown input[type=radio] {
    cursor: pointer;
    margin-bottom: 0;
}

.irina-markdown input[type=text],
.irina-markdown input[type=password],
.irina-markdown textarea,
.irina-markdown select {
    display: inline-block;
    width: 210px;
    padding: 4px;
    font-size: 13px;
    font-weight: normal;
    line-height: 18px;
    height: 18px;
    color: #808080;
    border: 1px solid #ccc;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}

.irina-markdown select,
.irina-markdown input[type=file] {
    height: 27px;
    line-height: 27px;
}

.irina-markdown textarea {
    height: auto;
}

/* grey out placeholders */
.irina-markdown :-moz-placeholder {
    color: #bfbfbf;
}

.irina-markdown ::-webkit-input-placeholder {
    color: #bfbfbf;
}

.irina-markdown input[type=text],
.irina-markdown input[type=password],
.irina-markdown select,
.irina-markdown textarea {
    -webkit-transition: border linear 0.2s, box-shadow linear 0.2s;
    -moz-transition: border linear 0.2s, box-shadow linear 0.2s;
    transition: border linear 0.2s, box-shadow linear 0.2s;
    -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.irina-markdown input[type=text]:focus,
.irina-markdown input[type=password]:focus,
.irina-markdown textarea:focus {
    outline: none;
    border-color: rgba(82, 168, 236, 0.8);
    -webkit-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
    -moz-box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(82, 168, 236, 0.6);
}

/* buttons */
.irina-markdown button {
    display: inline-block;
    padding: 4px 14px;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 13px;
    line-height: 18px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    background-color: #0064cd;
    background-repeat: repeat-x;
    background-image: -khtml-gradient(linear, left top, left bottom, from(#049cdb), to(#0064cd));
    background-image: -moz-linear-gradient(top, #049cdb, #0064cd);
    background-image: -ms-linear-gradient(top, #049cdb, #0064cd);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #049cdb), color-stop(100%, #0064cd));
    background-image: -webkit-linear-gradient(top, #049cdb, #0064cd);
    background-image: -o-linear-gradient(top, #049cdb, #0064cd);
    background-image: linear-gradient(to top, #049cdb, #0064cd);
    color: #fff;
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
    border: 1px solid #004b9a;
    border-bottom-color: #003f81;
    -webkit-transition: 0.1s linear all;
    -moz-transition: 0.1s linear all;
    transition: 0.1s linear all;
    border-color: #0064cd #0064cd #003f81;
    border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);
}

.irina-markdown button:hover {
    color: #fff;
    background-position: 0 -15px;
    text-decoration: none;
}

.irina-markdown button:active {
    -webkit-box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
    -moz-box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
    box-shadow: inset 0 3px 7px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
}

.irina-markdown button::-moz-focus-inner {
    padding: 0;
    border: 0;
}

.irina-markdown table {
    *border-collapse: collapse; /* IE7 and lower */
    border-spacing: 0;
    width: 100%;
}

.irina-markdown table {
    border: solid #ccc 1px;
    -moz-border-radius: 6px;
    -webkit-border-radius: 6px;
    border-radius: 6px;
    /*-webkit-box-shadow: 0 1px 1px #ccc;
    -moz-box-shadow: 0 1px 1px #ccc;
    box-shadow: 0 1px 1px #ccc;   */
}

.irina-markdown table tr:hover {
    background: #fbf8e9;
    -o-transition: all 0.1s ease-in-out;
    -webkit-transition: all 0.1s ease-in-out;
    -moz-transition: all 0.1s ease-in-out;
    -ms-transition: all 0.1s ease-in-out;
    transition: all 0.1s ease-in-out;
}

.irina-markdown table td,
.irina-markdown .table th {
    border-left: 1px solid #ccc;
    border-top: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}

.irina-markdown table th {
    background-color: #dce9f9;
    background-image: -webkit-gradient(linear, to left top, to left bottom, from(#ebf3fc), to(#dce9f9));
    background-image: -webkit-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: -moz-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: -ms-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: -o-linear-gradient(top, #ebf3fc, #dce9f9);
    background-image: linear-gradient(to top, #ebf3fc, #dce9f9);
    /*-webkit-box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;
    -moz-box-shadow:0 1px 0 rgba(255,255,255,.8) inset;
    box-shadow: 0 1px 0 rgba(255,255,255,.8) inset;*/
    border-top: none;
    text-shadow: 0 1px 0 rgba(255, 255, 255, .5);
    padding: 5px;
}

.irina-markdown table td:first-child,
.irina-markdown table th:first-child {
    border-left: none;
}

.irina-markdown table th:first-child {
    -moz-border-radius: 6px 0 0 0;
    -webkit-border-radius: 6px 0 0 0;
    border-radius: 6px 0 0 0;
}

.irina-markdown table th:last-child {
    -moz-border-radius: 0 6px 0 0;
    -webkit-border-radius: 0 6px 0 0;
    border-radius: 0 6px 0 0;
}

.irina-markdown table th:only-child {
    -moz-border-radius: 6px 6px 0 0;
    -webkit-border-radius: 6px 6px 0 0;
    border-radius: 6px 6px 0 0;
}

.irina-markdown table tr:last-child td:first-child {
    -moz-border-radius: 0 0 0 6px;
    -webkit-border-radius: 0 0 0 6px;
    border-radius: 0 0 0 6px;
}

.irina-markdown table tr:last-child td:last-child {
    -moz-border-radius: 0 0 6px 0;
    -webkit-border-radius: 0 0 6px 0;
    border-radius: 0 0 6px 0;
}

</style>