---
title: Flex Bison初体验
---

> 近来要做编译原理的实验，需要使用Flex和Bison这两款重量级工具。实验手册有30多页，在这里稍作总结（其实就是把重要的部分Copy一份出来）。
>
> “实验手册”指**NJU南京大学的编译实验手册**，俺虽然不是NJU学僧，但老师发的就是NJU的材料。羡慕NJU！
>
> 若涉嫌侵权请联系我删除，谢谢！

# 实验过程中的教训

## Flex

**符号|左右别有空格！**否则会报`unrecognized rule`。譬如：

```flex
RELOP ">" | "<" | ">=" | "<=" | "==" | "!="
```

修改为：

```
RELOP ">"|"<"|">="|"<="|"=="|"!="
```

**出错位置在报错行前一行找！**譬如某行报`unrecognized rule`，去找对应行的规则，重点关注对应行的规则上一行。

看群里说如果自定义了`yyerror`，需要加外部声明`extern xxx`不然会报`warning`

在Bison源代码中用`%union`和`%type<>`声明完类型后，我们就可以在Flex源代码中赋值。注意：此时不能直接是`yylval=xxx`，而应该是`yylval.type_name=xxxx`！！

需要为空白符号专门设置规则！不然会报错的...

## Bison

需要在Bison（而不是Flex）的源文件开头添加`%locations`以使用`yylloc`等变量！

关于`-`的优先级处理：`-`既可以是减号，也可以是取负，优先级和结合性都不一样。



# Flex

## CheatSheet

Flex库函数`yylex()`，该函数的作用就是**读取**输入文件中的一个**词法单元**。

变量 `yyin`是Flex内部使用的一个变量，表示**输入文件的文件指针**，如果我们不去设置它，那么Flex 会将它自动设置为`stdin`（即标准输入，通常连接到键盘）。

变量`yytext`的类型为`char*`，它是Flex为我们提供的一个变量，里面保存了**当前词法单元所对应的词素**。

若要自定义不匹配时的行为，在所有规则的**最后**加上一条`.`（即匹配任何输入）规则，然后在其对应的action部分书写你想要的行为即可。

`yyleng`是Flex为我们提供的变量，你可以将其理解为`strlen(yytext)`。

`yyrestart(f)`函数是Flex提供的库函数，它可以让Flex将其输入文件的文件指针**`yyin`设置为`f`**（当然你也可以像前面一样手动设置令`yyin = f`）并**重新初始化该文件指针**，令其指向输入文件的开头。

Flex内部提供了类似记录**行号**的变量，叫做`yylineno`。想要用它，要在Flex源代码的定义部分加入语句`%option yylineno`。但请注意：如果在词法分析过程中调用`yyrestart()`函数读取另一个输入文件时，它却**不会重新被初始化**，因此我们需要**自行添加初始化语句**`yylineno= 1`。

Flex库函数`input()`可以从当前的输入文件中**读入一个字符**（相当于是**直接挪动文件指针**而**不经过词法分析**）。

Flex库函数`unput(char c)`可以将**指定的字符放回输入缓冲区**中。

Flex库函数`yyless(int n)`可以将刚从输入缓冲区中读取的`yyleng−n`个字符放回到输入缓冲区中（反向理解：保留前面的`n`个字符，将剩下的后面的字符全部放回缓冲区）。

Flex库函数`yymore()`可以告诉Flex保留当前词素，并在下一个词法单元被识别出来之后将下一个词素连接到当前词素的后面。

Flex宏`REJECT`**将`yytext`放回输入之内**，然后去**试图匹配当前规则之后的那些规则**。

`yylval`是Flex的内部变量，表示当前**词法单元所对应的属性值**。

`yylloc`是Flex的内置变量，表示当前词法单元所对应的位置信息。

`YY_USER_ACTION`宏表示在执行每一个动作之前需要先被执行的一段代码，默认为空。

## 词法分析概述

英文比较容易断词：相邻的英文字母一定属于同一个词，而字母与字母之间插入任何非字母的字符（如空格、运算符等）就可以将一个词断成两个词。

## GNU Flex介绍

假设这写好的代码名为`lexical.l`。随后，我们使用Flex对该代码进行编译：

```shell
flex lexical.l
```

编译好的结果会保存在当前目录下的`lex.yy.c`文件中。

这份源代码里有一个函数叫做`yylex()`，该函数的作用就是**读取**输入文件中的一个**词法单元**。

变量 `yyin`是Flex内部使用的一个变量，表示**输入文件的文件指针**，如果我们不去设置它，那么Flex 会将它自动设置为`stdin`（即标准输入，通常连接到键盘）。

> 注意，如果你将`main`函数独立设为一个文件，则需要声明`yyin`为外部变量：`extern FILE* yyin`。

然后编译这两个C源文件。我们将输出程序命名为`scanner`：

```shell
gcc main.c lex.yy.c -lfl -o scanner
```

其中`-lfl`参数指定要使用Flex的库文件，不能少。

想要对一个测试文件`test.cmm`进行词法分析，仅需：

```shell
./scanner test.cmm
```

## 编写源代码

Flex源代码文件包括三个部分，由“%%”隔开，如下所示：

```
{definitions}
%%
{rules}
%%
{user subroutines}
```

第一部分为**定义部分**，实际上就是给某些后面可能经常用到的正则表达式取一个别名，定义部分的格式一般为：

```
name definition
```

譬如：`letter [a-zA-Z]`

在规则中使用定义过的正则表达式的别名的话，需要为别名套上`{}`。

第二部分为**规则部分**，它由正则表达式和相应的响应函数组成，其格式为：

```
pattern {action}
```

其中`pattern`为正则表达式，`action`为将要进行的具体操作，这些操作可以用一段C代码表示。

譬如：`{letter}+ {printf("%s", yytext);}`

其中变量`yytext`的类型为`char*`，它是Flex为我们提供的一个变量，里面保存了**当前词法单元所对应的词素**。

若要自定义不匹配时的行为，在所有规则的**最后**加上一条`.`（即匹配任何输入）规则，然后在其对应的action部分书写你想要的行为即可。

第三部分为**用户自定义代码部分**。这部分代码会被原封不动地拷贝到`lex.yy.c`中，以方便用户自定义所需要执行的函数。如果用户想要**对自定义代码部分所用到的变量、函数或者头文件进行声明**，可以在前面的**定义部分**（即Flex源代码文件的第一部分）之前使用`%{`和`%}`符号将要声明的内容添加进去。被`%{`和`%}`所包围的内容也会一并拷贝到`lex.yy.c`的最前面。

> 注意是`%{`和`%}`，而不是`}%`，否则用flex时会报`premature EOF`错误

`yyleng`是Flex为我们提供的变量，你可以将其理解为`strlen(yytext)`。

譬如：`{letter}+ { words++; chars+= yyleng; }`

`yyrestart(f)`函数是Flex提供的库函数，它可以让Flex将其输入文件的文件指针**`yyin`设置为`f`**（当然你也可以像前面一样手动设置令`yyin = f`）并**重新初始化该文件指针**，令其指向输入文件的开头。

譬如：

```c
FILE *f = fopen(argv[i], "r");
if (!f) {
    perror(argv[i]);
    return 1;
}
yyrestart(f);
yylex();
```

## 书写正则表达式

- 符号`[`和`]`共同匹配一个字符类，即方括号之内只要有一个字符被匹配上了，那么被方括号括起来的整个表达式都被匹配上了。
- 符号`"`（英文引号）将**逐字匹配被引起来的内容**（即**无视**各种**特殊符号及转义字符**）。例如，表达式`"..."`就表示三个点而不表示三个除换行符以外的任意字符。
- 符号`/`会查看输入字符的上下文，例如，`x/y`识别`x`仅当在输入文件中`x`之后紧跟着`y`，`0/1`可以匹配输入串01中的0但不匹配输入串02中的0。

## 高级特性

在写编译器程序的过程中，经常会需要记录**行号**，可以自己定义某个变量，例如`lines`，每当识别出`\n`我们就让`lines = lines + 1`。

Flex内部提供了类似记录**行号**的变量，叫做`yylineno`。想要用它，要在Flex源代码的定义部分加入语句`%option yylineno`。但请注意：如果在词法分析过程中调用`yyrestart()`函数读取另一个输入文件时，它却**不会重新被初始化**，因此我们需要**自行添加初始化语句**`yylineno= 1`。

> 关于输入缓冲区的部分，略了。

Flex库函数`input()`可以从当前的输入文件中**读入一个字符**（相当于是**直接挪动文件指针**而**不经过词法分析**）。

譬如：实现在输入文件中发现双斜线`//`后，将从当前字符开始一直到行尾的所有字符全部丢弃掉（即忽略注释）：

```c
%%
"//" {
  char c = input();
  while (c != '\n') c = input();
}
```

Flex库函数`unput(char c)`可以将**指定的字符放回输入缓冲区**中。譬如：当在输入文件中遇到字符串`BUFFER_LEN`时，下面这段代码将该宏所对应的内容（`1024`）放回输入缓冲区：

```c
char* p = macro_contents("BUFFER_LEN"); // p = “1024”
char* q = p + strlen(p);
while(q > p) unput(*--q);
```

> 透过上面的示例代码，可以看到是**逆序放回缓冲区**的。
>
> ```
> [原本的待读入内容]
> [4原本的待读入内容]
> [24原本的待读入内容]
> [024原本的待读入内容]
> [1024原本的待读入内容]
> ```

Flex库函数`yyless(int n)`可以将刚从输入缓冲区中读取的`yyleng−n`个字符放回到输入缓冲区中（反向理解：保留前面的`n`个字符，将剩下的后面的字符全部放回缓冲区）。函数`yymore()`可以告诉Flex保留当前词素，并在下一个词法单元被识别出来之后将下一个词素连接到当前词素的后面。配合使用`yyless()`和`yymore()`可以方便地处理那些边界难以界定的模式。

例如，我们在为字符串常量书写正则表达式时，往往会写成由一对双引号引起来的所有内容`\"[^\"]*\"`，但有时候**被双引号引起来的内容**里面**也可能出现跟在转义符号之后的双引号**，例如`"This is an \"example\""`。那么如何使用Flex处理这种情况呢？方法之一就是借助于`yyless`和`yymore`：

```flex
{\"[^\"]*\"} {
    if(yytext[yyleng-2] == '\\') //如果倒第二个字符是斜杠，说明是转义字符
    {
        yyless(yyleng-1); //把"放回缓冲区
        yymore();//下面识别出来的词素拼在当前词素后面
    } else{
        //这把是真处理完了，该咋整咋整
    }
}
```

Flex宏`REJECT`可以帮助我们识别那些互相重叠的模式。当我们执行`REJECT`之后，Flex会进行一系列的操作，这些操作的结果相当于**将`yytext`放回输入之内**，然后去**试图匹配当前规则之后的那些规则**。

譬如：统计输入文件中所有的`pink`、`ink`和`pin`出现的个数，即使这三个单词之间互有重叠。

```c
pink {pink++; REJECT;}
ink {ink++; REJECT;}
pin {pin++; REJECT;}
```

# Bison

## 语法分析概述

语法分析程序的主要任务是**读入词法单元流**、判断输入程序是否匹配程序设计语言的语法规范，并在匹配规范的情况下**构建起输入程序的静态结构**。

Bison所生成的语法分析程序采用了自底向上的LALR(1)分析技术。

## GNU Bison介绍

假设这份写好的Bison源代码名为`syntax.y`。随后，我们使用Bison对这份代码进行编译：

```shell
bison syntax.y
```

编译好的结果会保存在当前目录下的`syntax.yy.c`文件中。打开这个文件你就会发现，该文件本质上就是一份C语言的源代码。

这个文件中有一个函数`yyparse()`，该函数的作用就是对输入文件进行语法分析，如果分析成功没有错误则返回0，否则返回非0。

Bison通过`yylex()`来获得词法单元，这个函数由用户为它提供。但因为我们之前已经使用Flex生成了一个`yylex()`函数，让Bison使用Flex生成的`yylex()`函数即可。

仍以Bison源代码文件`syntax.y`为例。首先，**为了能够使用Flex中的各种函数**，需要**在Bison源代码中引用**`lex.yy.c`：

```c
#include "lex.yy.c"
```

随后在使用Bison编译这份源代码时，我们需要加上“-d”参数：

```shell
bison -d syntax.y
```

这个参数的含义是，将编译的结果分拆成`syntax.tab.c`和`syntax.tab.h`两个文件，其中`.h`文
件里包含着一些**词法单元的类型定义**之类的内容。

得到这个.h文件之后，下一步是修改我们的Flex源代码`lexical.l`，增加对`syntax.tab.h`的引用，并且让Flex源代码中规则部分的**每一条action都返回相应的词法单元**。（相当于是Bison给Flex提要求：老弟，过会你把词法单元给我的时候，按我能识别的方式来啊！）

```c
%{
  #include "syntax.tab.h"
  …
%}
…
%%
"+" { return PLUS; }
"-" { return SUB; }
"&&" { return AND; }
"||" { return OR; }
…
```

其中，返回值PLUS和SUB等都是在Bison源代码中定义过的词法单元（也就是在`syntax.tab.h`）里面。由于我们刚刚修改了`lexical.l`，需要重新将它编译出来：

```shell
flex lexical.l
```

接下来是重写我们的`main`函数。由于Bison会在需要时**自动调用`yylex()`**，我们在main函数中也就不需要调用它了。不过，Bison是**不会自己调用`yyparse()`和`yyrestart()`的**，因此这两个函数仍需要我们在main函数中显式地进行调用：

```c
int main(int argc, char** argv)
{
  if (argc <= 1) return 1;
  FILE* f = fopen(argv[1], "r");
  if (!f)
  {
    perror(argv[1]);
    return 1;
  }
  yyrestart(f);
  yyparse();
  return 0;
}
```

现在我们有了三个C语言源代码文件：`main.c`、`lex.yy.c`以及`syntax.tab.c`，其中`lex.yy.c`已经被`syntax.tab.c`引用了，因此我们最后要做的就是把`main.c`和`syntax.tab.c`放到一起进行编译：

```shell
gcc main.c syntax.tab.c -lfl -ly -o parser
```

> 其中“-lfl”不要省略，否则GCC会因缺少库函数而报错，但“-ly”这里一般情况下可以
> 省略。如果加上“-ly”参数，编译报错，可以安装libbison-dev依赖库。

现在我们可以使用这个parser程序进行语法分析了。例如，想要对一个输入文件`test.cmm`进行语法分析，只需要在命令行输入：

```shell
./parser test.cmm
```

## 编写源代码

Bison源代码也分为三个部分，其作用与Flex源代码大致相同。

第一部分是**定义部分**，所有**词法单元的定义**都可以放到这里；

第二部分是**规则部分**，其中包括具体的语法和相应的语义动作；

第三部分是**用户函数部分**，这部分的源代码会被原封不动地拷贝到`syntax.tab.c`中，以方便用户自定义所需要的函数（`main`函数也可以写在这里，不过不推荐这么做）。

值得一提的是，如果用户想要对这部分所用到的变量、函数或者头文件进行声明，可以在定义部分（也就是Bison源代码的第一部分）之前使用“%{”和“%}”符号将要声明的内容添加进去。被“%{”和“%}”所包围的内容也会被一并拷贝到`syntax.tab.c`的最前面。

给定语法：

```
Calc → ε
| Exp
Exp → Factor
| Exp ADD Factor
| Exp SUB Factor
Factor → Term
| Factor MUL Term
| Factor DIV Term
Term → INT
```

编写Bison源代码

```c
%{
#include <stdio.h>
%}

/* declared tokens */
/* 对终结符进行了声明 */
%token INT
%token ADD SUB MUL DIV

%%
Calc : /* empty */
  | Exp { printf("= %d\n", $1); }
  ;
Exp : Factor
  | Exp ADD Factor { $$ = $1 + $3; }
  | Exp SUB Factor { $$ = $1 - $3; }
  ;
Factor : Term
  | Factor MUL Term { $$ = $1 * $3; }
  | Factor DIV Term { $$ = $1 / $3; }
  ;
Term : INT
  ;
%%
#include "lex.yy.c"
int main() {
  yyparse();
}
yyerror(char* msg) {
  fprintf(stderr, "error: %s\n", msg);
}
```

几个值得注意的点：

- 以`%token`开头的是**词法单元（终结符）**的定义
- 未被定义为`%token`的符号都会被看作非终结符，要求必须在任意产生式的**左边**至少出现一次
- **第一个产生式左边的非终结符**默认为**初始符号**
- 产生式里的箭头用冒号`:`表示，一组产生式与另一组之间以分号`;`隔开。
- 终结符和非终结符都各自对应一个属性值：
  - 产生式**左边的非终结符**对应的属性值用`$$`表示
  - 产生式**右边的文法符号**对应的属性值从左到右的顺序依次对应为`$1`、`$2`、`$3`等
- 产生式的最后可以添加一组以花括号“{”和“}”括起来的语义动作，如果不明确指定语义动作，Bison将采用默认的语义动作`{ $$ = $1 }`
- `yyerror()`函数会在你的语法分析程序**每发现一个语法错误时被调用**，默认情况下`yyerror()`只会将传入的字符串参数打印到标准错误输出上，可以自定义。

非终结符的属性值都可以通过它所产生的那些终结符或者非终结符的属性值计算出来，但是**终结符本身的属性值该如何得到**呢？

答案是：在`yylex()`函数中得到。因而我们要修改前面的Flex源代码（假设在我们的Flex源代码中，INT词法单元对应着一个数字串）：

```c
…
digit [0-9]
%%
{digit}* {
  yylval = atoi(yytext);
  return INT;
}
…
%%
…
```

`yylval`是Flex的内部变量，表示当前**词法单元所对应的属性值**。我们只需将该变量的值赋成`atoi(yytext)`，就可以将词法单元INT的属性值设置为它所对应的整数值了。

## 属性值的类型

在我们构建语法树的过程中，我们希望**不同的符号对应的属性值**能有**不同的类型**。

方法一是对宏`YYSTYPE`进行重定义。Bison里会**默认所有属性值的类型以及变量`yylval`的类型**都是`YYSTYPE`，默认情况下`YYSTYPE`被定义为`int`。

方法一最大的缺点是把所有的变量属性值的类型都给他变了，但我们想要的是不同属性值能有不同的类型，不管。

方法二要点如下：

- 首先，我们在定义部分的开头使用`%union{…}`将所有可能的类型都包含进去
- 对于**词法单元**，在`%token`部分我们使用一对尖括号`<>`把需要确定属性值类型的每个词法单元所对应的类型括起来
- 对于**非终结符**，我们使用`%type`加上尖括号的办法确定它们的类型
- 当所有需要确定类型的符号的类型都被定下来之后，规则部分里的`$$`、`$1`等就自动地带有了相应的类型，不再需要我们显示地为其指定类型了。

譬如：

```c
%{
#include <stdio.h>
%}

/* declared types */
%union {
  int type_int;
  float type_float;
  double type_double;
}

/* declared tokens */
%token <type_int> INT
%token <type_float> FLOAT
%token ADD SUB MUL DIV

/* declared non-terminals */
%type <type_double> Exp Factor Term

%%
Calc : /* empty */
  | Exp { printf(“= %lf\n, $1); }
  ;
...
```

## 语法单元的位置

Bison中**每个语法单元**不仅都对应了一个属性值，还**对应了一个位置信息**，在语义动作中这些位置信息同样可以使用`@$`、`@1`、`@2`等进行引用。

位置信息的数据类型是一个`YYLTYPE`，其默认的定义是：

```c
typedef struct YYLTYPE {
  int first_line;
  int first_column;
  int last_line;
  int last_column;
}
```

其中的`first_line`和`first_column`分别是该语法单元对应的**第一个词素出现的行号和列号**，而`last_line`和`last_column`分别是该语法单元对应的最后一个词素出现的行号和列号。

但注意，如果直接引用`@1`、`@2`等将每个语法单元的`first_line`打印出来，你会发现打印出来的行号全都是1。Bison并不会主动替我们维护这些位置信息，我们需要**在Flex源代码文件中自行维护**。

`yylloc`是Flex的内置变量，表示当前词法单元所对应的位置信息；`YY_USER_ACTION`宏表示在执行每一个动作之前需要先被执行的一段代码，默认为空，但可改正。`yycolumn`是自己定义的变量。

除此之外，最后还要在发现了换行符之后对变量`yycolumn`进行复位。

> 注意：**bison的源文件开头**一定要加上`%locations`

```c
%locations
…
%{
/* 此处省略#include部分 */
int yycolumn = 1;
#define YY_USER_ACTION \
  yylloc.first_line = yylloc.last_line = yylineno; \
  yylloc.first_column = yycolumn; \
  yylloc.last_column = yycolumn + yyleng - 1; \
  yycolumn += yyleng;
%}
%%
\n { yycolumn = 1; }
%%
```

## 错误恢复

> 突然想到一个很好玩的事情，既然每行只会出现一个错误，为什么不把换行符当作兜底符号呢（笑）

为啥要错误恢复？关键在于“**恢复**”二字。将导致错误的词法成分算到某个语法成分里，使语法分析能够正常的分析下去，这才是错误恢复的目的，也是我们下面插`error`的目的。

> 请牢记：语法分析的终结符是词法单元，如果语法分析出错了，说明是当前的词法单元不对，而不是输入串中的最前面的字符不对！

由于本实验要识别具体的Type B类型，所以还要了解Bison错误恢复的机制。

课程上我们说“恐慌模式”错误恢复的本质是**跳过出错的语法成分**，**继续分析**该**出错部分之后的字符**。`error`符号便是代表了**出错的语法成分**。产生式中`error`后面的语法成分决定了**出错部分之后的字符**（`error`后面的语法成分的`FIRST`集合）。

譬如`int a[5,,,3]`，使用产生式`VarDec -> VarDec LB INT RB;`，有规约过程：

```
VarDec => VarDec LB INT RB
       => VarDec LB INT RB LB INT RB
                        ^^
```

相当于是当前栈中已有`VarDec LB INT[栈顶]`，下面期待来一个`RB`，没想到来一个`COMMA`，在分析表找不到对应的规则，于是报错。

假设有产生式`VarDec -> VarDec LB INT error RB;`，那么`INT`便是一个可移入`ERROR`的状态。接着便会抛弃输入符号中的`,,,`直到遇到`RB`为止，`a[5,,,3]`最终被规约为了`VarDec`，继续后续的分析。

>  简而言之，发生错误时，将`error`放在输入串的开头，不断地弹出状态/符号栈，看谁后面能移入`error`，移入`error`后，便开始丢弃输入串中字符，直至能有字符能跟在`error`后面为止。

那么带有`error`的产生式的动作怎么写？

首先应调用`yyerror`输出带有`error`的产生式的对应错误成分。

最后调用`yyerrok;`，这是因为：我们知道在`error`之后能成功移入三个符号，才继续正常的语法分析；但像这个产生式`VarDec -> VarDec LB INT error RB;`，我们期望当成功移入`RB`这**一个符号**就可以继续进行语法分析的话，此时要使用`yyerrok;`来“说明”这个情况。

例如：

```bison
VarDec : VarDec error {yyerror("Missing \"]\"");yyerrok;} ;
```

按照上面的思路，加了`error`后，却没有输出我们指定的错误信息，此时应该考虑：出错涉及的产生式是不是还没有加入`error`。譬如我们上面举的例子`int a[5,,,3]`，会对应到`VarDec`这个产生式。但是对于`a[5,,,3] = 3;`，如果要识别它识别缺少`]`的情况，我们还要对`Exp->Exp RB Exp LB`这个产生式添加`error`才行。

> 别问我怎么知道的，问就是开Debug看自动机是怎么运转的

那么在实验当中要考虑哪些潜在的语法错误呢？

毕竟`error`代表的是会出错的语法单元。不妨**先看看哪些语法单元会出错**吧！处理以这个语法单元为左部的产生式后，就不用在顶层担心这个语法单元会出错了。有一种**自底向上**的感觉啊！

- 括号的匹配：包括不限于`[ ]`、`( )`、`{ }`
- 结束符：`;`
- 表达式：对`Exp -> xxx`一系列式子进行处理后，就没必要在上层有`Exp`的地方进行处理了。
- `xxxList`不用考虑，如果`xxxList`出问题，肯定是`xxx`出问题了。

实验过程中出现了以下问题：

问题一：加入`error`式后，产生了移入-规约冲突；譬如：

```
ExtDef : Specifier ExtDecList error {yyerror("Missing \";\".");yyerrok;}
  | Specifier error {yyerror("Missing \";\".");yyerrok;}
  ;
```

乍一看没啥问题，但是，`ExtDecList`也是会导出`error`的唷！

```
ExtDecList : VarDec;
VarDec : VarDec error;
```

截取自动机的状态看一看

```
State 18

   10 ExtDecList: VarDec • //重点在这一行
   11           | VarDec • COMMA ExtDecList
   20 VarDec: VarDec • LB INT RB
   21       | VarDec • LB error RB
   22       | VarDec • error  //重点在这一行

    error  shift, and go to state 24
    COMMA  shift, and go to state 25
    LB     shift, and go to state 26

    error  [reduce using rule 10 (ExtDecList)]
    SEMI   reduce using rule 10 (ExtDecList)
 
 rule 10: ExtDecList: VarDec
              | VarDec COMMA ExtDecList
```

一个活前缀可能对应着不同产生式的不同的识别状态。譬如对于活前缀`VarDec ·`，可以是`ExtDecList: VarDec •`，也可以是`VarDec: VarDec • error`。如果是在`VarDec`后面出现了错，即跟在`VarDec`后面的语法单元和当前状态在分析表中没有对应条目时，可能会“弹出规则”，将`VarDec`还原成`ExtDecList`，也可能会根据`VarDec: VarDec • error`，移入`error`。



问题二：是`error SEMI`更好，还是单纯的`error`更好？

譬如：

```
Specifier ExtDecList SEMI {$$ = createNode("ExtDef", Others, NULL, @$.first_line, $1, NULL); $1->nextsibling=$2; $2->nextsibling=$3;}
①: Specifier ExtDecList error SEMI {yyerror("Missing \";\".");yyerrok;}
②: Specifier ExtDecList error {yyerror("Missing \";\".");yyerrok;}
```

我个人认为不加`SEMI`有助于更快的恢复。因为你本来就是缺分号，如果用①的话却还希望找到分号，势必会丢掉更多的输入单元。（输入文件中可能包含一个或者多个错误（**但输入文件的同一 行中保证不出现多个错误**），如果丢符号丢到下一行那就寄了）但我的这个观点好像和指导书有冲突...

出现语法错误的根源是词法单元串不匹配。个人感觉应该放在底层的产生式中，即词法单元旁边为妙。

两个都上行不行呢？答案是不行。譬如：

```
State 119

   71 Exp: ID LP Args error • RP
   72    | ID LP Args error •

    RP  shift, and go to state 126

    RP        [reduce using rule 72 (Exp)]
    $default  reduce using rule 72 (Exp)
```





如果`error`在产生式中间，很好理解。**如果`error`在一个产生式的开头**，会意味着什么呢？或者说`error`可以处在一个产生式的开头吗？应该是可以放在开头的，可以理解为为某个语法成分“兜底”？

譬如：`Stmt → error SEMI`，我这个`Stmt`确实是出错了，错哪里我是不知道，但在后续的分析中你得把我看成是`Stmt`！

是不是可以这样理解：

```
某状态：
StmtList → Stmt •StmtList
StmtList → •Stmt StmtList
Stmt → •error SEMI
```

开头是`error`，代表着其左部是在另外一个产生式右部的某个部分的。

产生式最后 能不能是`error`呢？如果产生式最后是`error`，意味着不管下面是啥字符，直接进行规约。譬如：

```
Exp LB error %prec LOW_PRIORITY {yyerror("Missing \"]\""); yyerrok;}
Exp LB error RB {yyerror("Wrong in Expression."); yyerrok;}
```

对于`a[=]`，读到`=`时出错。因为引起`error`的语法单元（`=`）还没有“移入”，只是“读到”了。当`error`入栈后，读到的还是引起`error`的语法单元（`=`），并不是`RB`，所以直接规约了，即便后面是有`RB`的。

从`Exp`开始搞起。牢记：`error`代表了出错的语法成分，是我们想要“跳过”的语法成分。
