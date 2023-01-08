const e=JSON.parse(`{"key":"v-2c9a8427","path":"/cpp/unit4.5.html","title":"C++ Primer Plus 第四点五章阅读笔记 - 指针和自由存储空间","lang":"zh-CN","frontmatter":{"title":"C++ Primer Plus 第四点五章阅读笔记 - 指针和自由存储空间","description":"指针与C++基本原理 面向对象编程和传统的过程性编程的区别在于，OOP强调在运行阶段（而不是编译阶段）进行决策。 起初要使用数组，就必须要写死元素个数。但是OOP中可以通过关键字new和delete在运行时动态分配内存。虽然C也可以使用malloc和free实现类似效果，但是C++会更易用一些。 常规变量使用&amp;来获取地址，指针变量用*来获取该地址存储的值。 声明和初始化指针","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/cpp/unit4.5.html"}],["meta",{"property":"og:site_name","content":"Jielahou's Blog"}],["meta",{"property":"og:title","content":"C++ Primer Plus 第四点五章阅读笔记 - 指针和自由存储空间"}],["meta",{"property":"og:description","content":"指针与C++基本原理 面向对象编程和传统的过程性编程的区别在于，OOP强调在运行阶段（而不是编译阶段）进行决策。 起初要使用数组，就必须要写死元素个数。但是OOP中可以通过关键字new和delete在运行时动态分配内存。虽然C也可以使用malloc和free实现类似效果，但是C++会更易用一些。 常规变量使用&amp;来获取地址，指针变量用*来获取该地址存储的值。 声明和初始化指针"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-01-08T14:30:27.000Z"}],["meta",{"property":"article:modified_time","content":"2023-01-08T14:30:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"C++ Primer Plus 第四点五章阅读笔记 - 指针和自由存储空间\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-01-08T14:30:27.000Z\\",\\"author\\":[]}"]]},"headers":[{"level":2,"title":"声明和初始化指针","slug":"声明和初始化指针","link":"#声明和初始化指针","children":[]},{"level":2,"title":"指针的危险","slug":"指针的危险","link":"#指针的危险","children":[]},{"level":2,"title":"指针和数字","slug":"指针和数字","link":"#指针和数字","children":[]},{"level":2,"title":"使用new来分配内存","slug":"使用new来分配内存","link":"#使用new来分配内存","children":[]},{"level":2,"title":"使用delete来删除内存","slug":"使用delete来删除内存","link":"#使用delete来删除内存","children":[]},{"level":2,"title":"使用new来创建动态数组","slug":"使用new来创建动态数组","link":"#使用new来创建动态数组","children":[{"level":3,"title":"创建动态数组","slug":"创建动态数组","link":"#创建动态数组","children":[]},{"level":3,"title":"使用动态数组","slug":"使用动态数组","link":"#使用动态数组","children":[]}]},{"level":2,"title":"指针和数组名的联系","slug":"指针和数组名的联系","link":"#指针和数组名的联系","children":[]},{"level":2,"title":"指针和数组名的区别","slug":"指针和数组名的区别","link":"#指针和数组名的区别","children":[]},{"level":2,"title":"数组名的地址？","slug":"数组名的地址","link":"#数组名的地址","children":[]},{"level":2,"title":"字符串字面值的本质","slug":"字符串字面值的本质","link":"#字符串字面值的本质","children":[]},{"level":2,"title":"字符串字面值的存储","slug":"字符串字面值的存储","link":"#字符串字面值的存储","children":[]},{"level":2,"title":"输出字符串的地址","slug":"输出字符串的地址","link":"#输出字符串的地址","children":[]},{"level":2,"title":"strcpy和strncpy的注意事项","slug":"strcpy和strncpy的注意事项","link":"#strcpy和strncpy的注意事项","children":[]}],"git":{"createdTime":1673101385000,"updatedTime":1673188227000,"contributors":[{"name":"jielahou","email":"jielahou@gmail.com","commits":3}]},"readingTime":{"minutes":6.62,"words":1987},"filePathRelative":"cpp/unit4.5.md","localizedDate":"2023年1月7日","excerpt":"<h1> 指针与C++基本原理</h1>\\n<p>面向对象编程和传统的过程性编程的区别在于，OOP强调在运行阶段（而不是编译阶段）进行决策。</p>\\n<p>起初要使用数组，就必须要写死元素个数。但是OOP中可以通过关键字<code>new</code>和<code>delete</code>在运行时动态分配内存。虽然C也可以使用<code>malloc</code>和<code>free</code>实现类似效果，但是C++会更易用一些。</p>\\n<p>常规变量使用<code>&amp;</code>来获取地址，指针变量用<code>*</code>来获取该地址存储的值。</p>\\n<h2> 声明和初始化指针</h2>","autoDesc":true}`);export{e as data};