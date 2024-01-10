import{_ as c,F as n,W as s,X as o,Y as e,Z as d,a0 as r,$ as i}from"./framework-cb524fb0.js";const t="/assets/screenshot_20231125093708-f286c1bb.png",l="/assets/caddyfile-visual-a21127e8.png",v="/assets/screenshot_20231125125557-90154672.png",b="/assets/screenshot_20231125130355-6ba2965a.png",u={},p=i('<p>Zotero支持通过WebDAV进行同步，恰本人有多台设备，有同步的需求。想起来手头还有一些吃灰的机器，拿出来跑一下WebDAV好了。</p><p>查找了一些方案，有基于Apache、Nginx、Caddy的，也有单独一个二进制解决所有问题的。一直想玩玩Caddy但没时间，趁这段时间闲一些，折腾折腾得了。</p><h2 id="下载二进制" tabindex="-1"><a class="header-anchor" href="#下载二进制" aria-hidden="true">#</a> 下载二进制</h2><p>进入官方下载页面，选择平台、架构后，搜索<code>webdav</code>插件并选中，此时<code>Extra features</code>会变成1。然后将其下载下来。</p><figure><img src="'+t+'" alt="screenshot_20231125093708" tabindex="0"><figcaption>screenshot_20231125093708</figcaption></figure><h2 id="编写caddyfile" tabindex="-1"><a class="header-anchor" href="#编写caddyfile" aria-hidden="true">#</a> 编写Caddyfile</h2><p>我们需要一个配置文件来配置Caddy，这个文件对于Nginx来说是<code>*.conf</code>文件，对于Caddy来说就是Caddyfile。Caddyfile有自己的一套简洁清晰的格式。</p><p>为了提升使用体验，笔者提前准备了一个域名，并配了A/AAAA记录到服务器。这是因为Caddy可以帮我们自动申请SSL证书而无需任何手动配置，唯一要求就是咱们得提前把域名绑好。</p><h3 id="caddyfile格式速通" tabindex="-1"><a class="header-anchor" href="#caddyfile格式速通" aria-hidden="true">#</a> Caddyfile格式速通</h3>',9),h={href:"https://caddyserver.com/docs/caddyfile/concepts",target:"_blank",rel:"noopener noreferrer"},m=i('<div class="hint-container info"><p class="hint-container-title">相关信息</p><p>如果想直接看写好的Caddyfile，请转到2.2节</p></div><figure><img src="'+l+`" alt="Caddyfile structure" tabindex="0"><figcaption>Caddyfile structure</figcaption></figure><p>我们只需关心<code>Site block</code>即可。<code>Site block</code>的基本格式为：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>域名 {
  #...
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由上图可知，<code>Site block</code>的内部可以包含<code>Matcher Definition</code>和<code>Directives</code>（指令），这里我们只关心<code>Directives</code>即可。</p><p><code>Directives</code>是指定站点工作方式的功能性关键词，其后可以跟随参数。</p><p><code>Directives</code>也可以有自己的子块（例如上面大蓝框里面的<code>reverse_proxy</code>），但一般情况下<code>Directives</code>子块里面不能再套<code>Directives</code>子块。</p><p>对于<code>HTTP handler</code>（处理HTTP请求）相关的<code>Directives</code>来说，这些<code>Directives</code>会打一套“组合拳”，而这一套组合拳是有顺序的。咱们写的<code>Directives</code>的处理顺序（例如上面图中先写了<code>reverse_proxy</code>，再写了<code>file_server</code>）和实际的处理顺序未必完全一致（除了在<code>route</code>、<code>handle</code>、<code>handle_path</code>等特殊块中）。Caddy默认是有一套顺序规则的，但由于<code>webdav</code>是第三方插件而不是官方插件，所以我们要手动指定<code>webdav</code>在<code>HTTP handler</code>中的顺序。</p><h3 id="生成密码" tabindex="-1"><a class="header-anchor" href="#生成密码" aria-hidden="true">#</a> 生成密码</h3><p>我们使用Caddy的<code>basicauth</code>模块来实现 有账户密码才能访问WebDAV 的功能。</p><p><code>basicauth</code>模块要求我们提供 经过<code>bcrypt</code>加密后的密码，这里用python的<code>bcrypt</code>包来加密。假设密码明文为<code>123456</code></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>import bcrypt
passwd=&quot;123456&quot;
salt = bcrypt.gensalt(rounds=10)
hashed = bcrypt.hashpw(passwd.encode(), salt)
print(hashed)
# b&#39;$2b$10$GdZwPjwlVpCaWP7KLpBhz.q1lTrUg6MytLARiyV5sr/xjxUwwbcOe&#39;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>print出来的结果<code>$2b$10$GdZwPjwlVpCaWP7KLpBhz.q1lTrUg6MytLARiyV5sr/xjxUwwbcOe</code>即为我们将填入配置的 加密后的密码。</p><h3 id="编写caddyfile-1" tabindex="-1"><a class="header-anchor" href="#编写caddyfile-1" aria-hidden="true">#</a> 编写Caddyfile</h3><p>在第一步时，我们下载了二进制文件。现在，在这个二进制文件所在的目录下创建一个名为<code>Caddyfile</code>的文件，并写入配置。参考配置内容如下：</p><ul><li>假设我们的域名是<code>abc.test.com</code></li><li>假设我们要把<code>/webdav</code>目录拿来做WebDAV服务、存储WebDAV的文件</li><li>假设我们要验证的用户名是<code>hello</code>，密码是<code>123456</code></li></ul><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>abc.test.com {
    root * /webdav
    route {
        basicauth {
            hello $2b$10$GdZwPjwlVpCaWP7KLpBhz.q1lTrUg6MytLARiyV5sr/xjxUwwbcOe
        }
        # 上文的密码为bcrypt加密后的密文而不是明文
        webdav
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>对于Zotero：由于Zotero默认会使用<code>zotero</code>文件夹，所以，假设我们使用<code>/webdav</code>来提供WebDAV服务，我们最好提前创建好<code>/webdav/zotero</code>文件夹。</p><figure><img src="`+v+`" alt="screenshot_20231125125557" tabindex="0"><figcaption>screenshot_20231125125557</figcaption></figure></blockquote><h2 id="运行caddy" tabindex="-1"><a class="header-anchor" href="#运行caddy" aria-hidden="true">#</a> 运行Caddy</h2><p>先确认一下Caddy二进制所在的文件夹是不是有我们刚刚写好的Caddyfile</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>$ ls
Caddyfile  [Caddy二进制文件]
$ cat Caddyfile
abc.test.com {
    root * /webdav
    route {
        basicauth {
            hello $2b$10$GdZwPjwlVpCaWP7KLpBhz.q1lTrUg6MytLARiyV5sr/xjxUwwbcOe
        }
        webdav
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，直接运行二进制文件，传入参数<code>run</code>即可。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>./[Caddy二进制文件] run
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="后记-在zotero中添加同步" tabindex="-1"><a class="header-anchor" href="#后记-在zotero中添加同步" aria-hidden="true">#</a> 后记：在Zotero中添加同步</h2><p>默认在顶栏编辑→首选项→同步是没有WebDAV选项的，必须先注册一个账户、登录了才有（即便是用自己的WebDAV而不是官方的服务）</p><p>接着填写域名、设置好的用户名、密码，Pass : )</p><figure><img src="`+b+'" alt="screenshot_20231125130355" tabindex="0"><figcaption>screenshot_20231125130355</figcaption></figure>',27);function f(y,g){const a=n("ExternalLinkIcon");return s(),o("div",null,[p,e("blockquote",null,[e("p",null,[d("官方文档："),e("a",h,[d("Caddyfile Concepts — Caddy Documentation (caddyserver.com)"),r(a)])])]),m])}const _=c(u,[["render",f],["__file","linux_webdav.html.vue"]]);export{_ as default};