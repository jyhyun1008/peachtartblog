
let vh = window.innerHeight * 0.01;
let vw = window.innerWidth * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// 리사이즈
window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    let vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
})

function parseMd(md){

    var md0 = md;
  
    //ul
    md = md.replace(/^\s*\n\*\s/gm, '<ul">\n* ');
    md = md.replace(/^(\*\s.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\*\s(.+)/gm, '<li class="list before">$1</li>');
    
    //ul
    md = md.replace(/^\s*\n\-\s/gm, '<ul>\n* ');
    md = md.replace(/^(\-\s.+)\s*\n([^\-])/gm, '$1\n</ul>\n\n$2');
    md = md.replace(/^\-\s(.+)/gm, '<li class="list before">$1</li>');
    
    //ol
    md = md.replace(/^\s*\n\d\.\s/gm, '<ol>\n1. ');
    md = md.replace(/^(\d\.\s.+)\s*\n([^\d\.])/gm, '$1\n</ol>\n\n$2');
    md = md.replace(/^\d\.\s(.+)/gm, '<li>$1</li>');
    
    //blockquote
    md = md.replace(/^\>(.+)/gm, '<blockquote>$1</blockquote>');
    md = md.replace('</blockquote><blockquote>', '');
    md = md.replace('</blockquote>\n<blockquote>', '\n');

    //hr
    md = md.replace(/[\-]{3}/g, '</div></div><div class="item_wrap"><div class="line">✿</div><div class="item">');
    
    //h
    md = md.replace(/\n[\#]{6}(.+)/g, '<h6>$1</h6>');
    md = md.replace(/\n[\#]{5}(.+)/g, '<h5>$1</h5>');
    md = md.replace(/\n[\#]{4}(.+)/g, '<h4>$1</h4>');
    md = md.replace(/\n[\#]{3}(.+)/g, '<h3>$1</h3>');
    md = md.replace(/\n[\#]{2}(.+)/g, '<h2>$1</h2>');
    md = md.replace(/\n[\#]{1}(.+)/g, '</div></div><div class="item_wrap"><div class="line">✿</div><div class="item"><h1>🎼 $1</h1>');
    
    //images with links
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<div class="gallery"><a href="$3"><img class="postimage" src="$2" alt="$1" width="100%" /></a></div>');
    
    //images
    md = md.replace(/\!\[([^\]]+)\]\(([^\)]+)\)/g, '<img class="postimage" src="$2" alt="$1" width="100%" />');
    
    //links
    md = md.replace(/[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g, '<a href="$2" title="$4">$1</a>');
    
    //font styles
    md = md.replace(/[\*]{2}([^\*]+)[\*]{2}/g, '<strong>$1</strong>');
    md = md.replace(/[\*]{1}([^\*]+)[\*]{1}/g, '<i>$1</i>');
    md = md.replace(/[\~]{2}([^\~]+)[\~]{2}/g, '<del>$1</del>');


    //주석
    md = md.replace(/\n[\/]{2}(.+)/g, '');
    

    //pre
    
    var mdpos = [];
    var rawpos = [];
    let pos1 = -1;
    let k = 0;

    var diff = [0]

    while( (pos1 = md0.indexOf('\n```', pos1 + 1)) != -1 ) { 
        if (k % 2 == 0){
            rawpos[k] = pos1 + 4;
        } else {
            rawpos[k] = pos1;
        }
        k++;
    }

    let pos2 = -1;
    let l = 0;

    while( (pos2 = md.indexOf('\n```', pos2 + 1)) != -1 ) { 
        if (l % 2 == 0){
            mdpos[l] = pos2 - 1;
        } else {
            mdpos[l] = pos2 + 5;
        }
        l++;
    }


    for (var i = 0; i < mdpos.length; i++){
        if (i % 2 == 0){
            md = md.replace(md.substring(mdpos[i] - diff[i], mdpos[i+1] - diff[i]), '<pre class="code">'+md0.substring(rawpos[i], rawpos[i+1])+'</pre>');

            var mdSubStringLength = mdpos[i+1] - mdpos[i];
            var rawSubStringLength = rawpos[i+1] - rawpos[i] + '<pre class="code">'.length + '</pre>'.length;
            diff[i+2] = diff[i] + mdSubStringLength - rawSubStringLength;

        }
    }

    //code
    md = md.replace(/[\`]{1}([^\`]+)[\`]{1}/g, '<code>$1</code>');

    //br
    md = md.replace(/\n\n/g, '</p><p>');
    
    return md;
    
}


function parseMFM(md){

    //MFM->MD

    var md0 = md;
  
    //ul
    md = md.replace(/\:arrow\_right\:/gm, '*');
    md = md.replace(/\:peachtart\:\s/gm, '🍑')
    md = md.replace(/\:(.+)\:/gm, '')
    
    //h
    md = md.replace(/\n\$\[x2\s(.+)\]/gm, '## $1');
    
    //links
    md = md.replace(/\?\[(.+)\]/gm, '[$1]');

    return md;
    
}

function getQueryStringObject() {
    var a = window.location.search.substr(1).split('&');
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
}

var qs = getQueryStringObject();
var page = qs.p;
var category = qs.cat;
var article = qs.a;

if (!page) {
    var url = "https://raw.githubusercontent.com/jyhyun1008/peachtartblog/main/README.md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#posttitle").innerText = 'INFORMATION'
        document.querySelector("#postcontent").innerHTML += parseMd(out)
    })
    .catch(err => { throw err });
} else if (page == 'blog' && category != null) {
    document.querySelector("#posttitle").innerText = category
    const findPageUrl = 'https://i.peacht.art/api/users/pages'
    const findPageParam = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            userId: '9gsrcnxa0g',
            limit: 100,
        }),
    }
    fetch(findPageUrl, findPageParam)
    .then((PageData) => {return PageData.json()})
    .then((PageRes) => {
        var pageId = []
        var pageUrl = []
        var pageTitle = []
        var pageSummary = []
        var pageImage = []
        for (var i=0; i<PageRes.length; i++){
            if (PageRes[i].summary && PageRes[i].summary.includes("#"+category)) {
                pageId.push(PageRes[i].id)
                pageUrl.push("https://i.peacht.art/@hyun1008/pages/"+PageRes[i].name)
                pageTitle.push(PageRes[i].title)
                if (PageRes[i].summary != null) {
                    pageSummary.push(PageRes[i].summary)
                } else {
                    pageSummary.push('')
                }
                pageImage.push(PageRes[i].eyeCatchingImage.url)
            }
        }
        for (var i=0; i<pageTitle.length; i++) {
            document.querySelector("#postcontent").innerHTML += '<div class="section"></div>'
            document.getElementsByClassName("section")[i].innerHTML += '<div class="blogPostTitle"><a href="?p=blog&a='+pageId[i]+'">'+pageTitle[i]+'</a></div>'
            document.getElementsByClassName("section")[i].innerHTML += '<div><a href="?p=blog&a='+pageId[i]+'"><img class="eyecatchimg" src="'+pageImage[i]+'"></div>'
            document.getElementsByClassName("section")[i].innerHTML += '<div>'+pageSummary[i]+'</div>'
        }
    })
    .catch(err => { throw err });
} else if (page == 'blog' && article != null) {
    document.querySelector("#posttitle").innerText = 'BLOG'
    const findPageUrl = 'https://i.peacht.art/api/pages/show'
    const findPageParam = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            pageId: article,
        }),
    }
    fetch(findPageUrl, findPageParam)
    .then((PageData) => {return PageData.json()})
    .then((PageRes) => {

        function makePageText(content, attFiles) {
            var result = ''
            for (var i=0; i <content.length; i++){
                if (content[i].type == 'section') {
                    if (!content[i].title.includes("𝙹𝙰𝙴𝚈𝙴𝙾𝙽'𝚜 𝙿𝚘𝚛𝚝𝚏𝚘𝚕𝚒𝚘") && !content[i].title.includes("𝕁𝔸𝔼𝕐𝔼𝕆ℕ'𝕤 ℕ𝕆𝕋𝔼ℙ𝔸𝔻")) {
                        result = result + '\n#' + content[i].title
                        for (var j = 0; j < content[i].children.length; j++){
                            if (content[i].children[j].type == 'text') {
                                result = result + '\n' + parseMFM(content[i].children[j].text)
                            } else if (content[i].children[j].type == 'image') {
                                var fileId = content[i].children[j].fileId
                                var fileUrl = ''
                                for (var k = 0; k <attFiles.length; k++){
                                    if (attFiles[k].id == fileId) {
                                        fileUrl = attFiles[k].url
                                    }
                                }
                                result = result + '\n<img class="postimage" src="' + fileUrl + '">'
                            } else if (content[i].children[j].type == 'note') {
                                var noteId = content[i].children[j].note
                                result = result + '\n<div>[노트 참조](https://i.peacht.art/' + noteId + ')</div>'
                            }
                        }
                    }
                } else if (content[i].type == 'text') {
                    result = result + '\n' + parseMFM(content[i].text)
                } else if (content[i].type == 'image') {
                    var fileId = content[i].fileId
                    var fileUrl = ''
                    for (var k = 0; k <attFiles.length; k++){
                        if (attFiles[k].id == fileId) {
                            fileUrl = attFiles[k].url
                        }
                    }
                    result = result + '\n<img class="postimage" src="' + fileUrl + '">'
                } else if (content[i].type == 'note') {
                    var noteId = content[i].note
                    result = result + '\n?quote(' + noteId + ')'
                }
            }
            return result
        }

        var pageUrl = "https://i.peacht.art/@hyun1008/pages/"+PageRes.name
        var pageTitle = PageRes.title
        var pageImage = PageRes.eyeCatchingImage.url
        var pageText = makePageText(PageRes.content, PageRes.attachedFiles)
        document.querySelector("#posttitle").innerText = pageTitle
        document.querySelector("#postcontent").innerHTML += '<div><a href="'+pageUrl+'"><img class="eyecatchimg" src="'+pageImage+'"></div>'
        document.querySelector("#postcontent").innerHTML += parseMd(pageText)
        
    })
    .catch(err => { throw err });
} else if (page) {
    var url = "https://raw.githubusercontent.com/jyhyun1008/peachtartblog/main/pages/"+page+"/.md"
    fetch(url)
    .then(res => res.text())
    .then((out) => {
        document.querySelector("#posttitle").innerText = page
        document.querySelector("#postcontent").innerHTML += parseMd(out)
    })
    .catch(err => { throw err });
}

