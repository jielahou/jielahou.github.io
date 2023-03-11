import{_ as t,W as e,X as r,$ as n}from"./framework-f7711481.js";const i="/assets/ulpi_example-77fc4119.png",a="/assets/lpi_bus_ownership-47676944.png",s="/assets/lpi_transfer_data-ede09d3f.png",o="/assets/lpi_abort_data-afff9398.png",d="/assets/asic_functional_blocks-19f7214e.png",h="/assets/utmi_plus_levels-81a3fc90.png",g={},l=n('<blockquote><p><s>笔者近期要做ULPI 2 UTMI转换的模块</s>，笔者近期要做UTMI的模块，故对学习过程进行记录。本文内容参考了UTMI、ULPI手册以及B站UP主叶倾城的视频。</p><p>希望能顺顺利利地完成相关工作！</p></blockquote><h1 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h1><p>为什么要有USB PHY芯片？</p><p>有一些不带USB接口的处理芯片，比如FPGA。它们都不能直接处理USB总线上的DP、DM的差模信号。所以，芯片厂商开发了一些USB PHY芯片，可以把DP、DM上的差模信号转成共模信号。</p><p>USB PHY负责最底层的信号转换，作用类似于网口的PHY。</p><p>USB信号传输前，需要通过PHY把USB控制器的数字信号转成线缆上的模拟信号。USB控制器和PHY之间的总线主要有3种：种是ULPI，一种是UTMI+，还有一种是HSIC。</p><p>UTMI （USB2.0 Transceiver Macrocell Interface）是一种用于USB controller和USBPHY通信的协议。相对于ULPI,UTMI有更多的控制信号，支持8bit/16bit数据接口。</p><p>ULPI协议的全称是UTMI+ Low PinInterface，从名字上就可以看出ULPI是UTMI的LowPin版本。</p><h1 id="ulti、utmi、utmi" tabindex="-1"><a class="header-anchor" href="#ulti、utmi、utmi" aria-hidden="true">#</a> ULTI、UTMI、UTMI+</h1><h2 id="utmi与umti" tabindex="-1"><a class="header-anchor" href="#utmi与umti" aria-hidden="true">#</a> UTMI与UMTI+</h2><blockquote><p>The purpose of this document is to specify an interface to which USB 2.0 ASIC, ASSP, discrete PHY, system peripherals and IP vendors can develop USB2.0 products. The existing UTMI specification describes an interface only for USB2.0 peripherals. The UTMI specification can not be used to develop USB 2.0 host or On-The-Go peripherals. The intention of this UTMI+ specification is to extend the UTMI specification to standardize the interface for USB 2.0 hosts and USB 2.0 On-The-Go peripherals. The UTMI+ specification defines and standardizes the interoperability characteristics with existing USB 2.0 hosts and peripherals.</p></blockquote><p>个人理解：UMTI只是为USB 2.0外设立下了规矩，而没有考虑主机设备、OTG设备。UTMI+对UMTI进行拓展，加入了对主机设备、OTG设备的支持。</p><h2 id="utli与utmi" tabindex="-1"><a class="header-anchor" href="#utli与utmi" aria-hidden="true">#</a> UTLI与UTMI+</h2><ol><li><p><strong>线的数量</strong>：ULPI的PIN少，UTMI+的PIN多。</p><p>一般来说如果芯片的USB PHY封装在芯片内，基本采用UTMI+的接口。不封装到芯片内的一般采用ULPI接口，这样可以降低pin的数量。 ULPI接口一共有12根信号线；UTMI+接口一共有24根、33根或大于33根信号线。 显然，UTMI+接口的信号线太多，占用大量的PCB空间，才需要推出ULPI接口。市场上，大多数的USB PHY芯片都是ULPI接口。</p></li><li><p><strong>是否需要读写寄存器</strong>：ULPI需要读写寄存器，而UTMI+只需直接拉高或拉低信号线。</p></li></ol><p>ULPI是在UTMI+的基础上封装了一层。</p><h1 id="lpi接口简介-别看" tabindex="-1"><a class="header-anchor" href="#lpi接口简介-别看" aria-hidden="true">#</a> LPI接口简介（别看）</h1><blockquote><p>忽略它吧！阿门！反正现阶段是用不上看这一块了（悲）</p><p>看到一半才发现Xilinx提供的IP核，不能用来实现USB Host啊，TMD！</p></blockquote><h2 id="概述-1" tabindex="-1"><a class="header-anchor" href="#概述-1" aria-hidden="true">#</a> 概述</h2><p>LPI(Low Pin Interface)是一个通用的接口规范，可以理解ULPI为LPI的一个特例。</p><blockquote><p>ULPI和LPI接口并不完全一致。这里只是相当于来点开胃菜，以便于更好的理解ULPI</p></blockquote><p>在介绍LPI接口前，需要考虑从谁的角度来介绍输入输出。考虑两端：PHY端和Link端</p><ul><li>PHY端：指USB PHY芯片</li><li>Link端：指连到PHY芯片上的FPGA</li></ul><figure><img src="'+i+'" alt="ulpi_example" tabindex="0"><figcaption>ulpi_example</figcaption></figure><h2 id="信号" tabindex="-1"><a class="header-anchor" href="#信号" aria-hidden="true">#</a> 信号</h2><p>下文给出的信号表格，是从PHY的角度介绍的。</p><table><thead><tr><th>信号</th><th>信号方向</th><th style="text-align:left;">介绍</th></tr></thead><tbody><tr><td><strong>clock</strong></td><td>I/O</td><td style="text-align:left;"><strong>时钟信号</strong>；可以输入，也可以输出；接口中的所有信号都要与<strong>clock</strong>同步。</td></tr><tr><td><strong>data</strong></td><td>I/O</td><td style="text-align:left;"><strong>数据信号</strong>；双向数据总线，在空闲期间由 Link 驱动为低电平；<br>Link和PHY使用非0模式串初始化数据传输；<br>通常是上升沿有效，也有上升、下降沿都有效的。</td></tr><tr><td><strong>dir</strong></td><td>OUT</td><td style="text-align:left;"><strong>方向</strong>(Direction)；表示数据总线的方向（毕竟<strong>data</strong>是双向的信号么）；<br>当PHY用总线给Link传输数据，<br>或PHY不能接受来自Link的数据时（如时钟不稳），便拉高<strong>dir</strong>；<br>当PHY没有要传送的数据时，拉低<strong>dir</strong>，监听总线；</td></tr><tr><td><strong>stp</strong></td><td>IN</td><td style="text-align:left;"><strong>停止</strong>(Stop)；当Link端要停止当前在总线上的数据流时，<br>便将<strong>stp</strong>拉高一个时钟周期。<br>如果此时是Link在向PHY传输数据，<strong>stp</strong>拉高意味着<strong>上一个周期</strong>传输的是<br>最后一个字节；<br>如果此时是PHY在向Link传输数据，<strong>stp</strong>拉高后，PHY停止传输数据，<br>并且拉低<strong>dir</strong>，放弃对总线的控制。</td></tr><tr><td><strong>nxt</strong></td><td>OUT</td><td style="text-align:left;"><strong>下一个</strong>(Next)；PHY设置这个信号，目的是为了节流(throttle)；<br>当PHY给Link发送数据时，<strong>nxt</strong>拉高意味着还有数据要发给link；<br>当Link给PHY发送数据时，<strong>nxt</strong>拉高意味着PHY已经接受这个周期的数据，<br>Link下个周期可以接着发。</td></tr></tbody></table><h2 id="协议" tabindex="-1"><a class="header-anchor" href="#协议" aria-hidden="true">#</a> 协议</h2><h3 id="总线所有权" tabindex="-1"><a class="header-anchor" href="#总线所有权" aria-hidden="true">#</a> 总线所有权</h3><p>正如前面介绍，总线所有权由<strong>dir</strong>信号控制，具体的时许关系见下图。</p><p>当<strong>dir</strong>拉高的时刻，<strong>data</strong>需要经历一个时钟周期，以切换总线所有权。</p><blockquote><p>令我感到奇怪的是，<code>turn around</code>周期的上升沿，<strong>dir</strong>取什么值？是既不高，也不低，还是高呢？我个人理解是拉高。</p></blockquote><figure><img src="'+a+'" alt="lpi_bus_ownership" tabindex="0"><figcaption>lpi_bus_ownership</figcaption></figure><h3 id="传输数据" tabindex="-1"><a class="header-anchor" href="#传输数据" aria-hidden="true">#</a> 传输数据</h3><p>如下图所示：在前半段，首先Link通过总线发送非0数据；在传输完最后一个字节<strong>后</strong>，拉高了<strong>stp</strong>；</p><p>在后半段，我们看到<strong>dir</strong>只有在PHY给Link传输的时候拉高，其余时候都是低；</p><p><strong>nxt</strong>和<strong>stp</strong>可能会在<strong>同一个上升沿</strong>被拉高。</p><figure><img src="'+s+'" alt="lpi_transfer_data" tabindex="0"><figcaption>lpi_transfer_data</figcaption></figure><h3 id="终止数据" tabindex="-1"><a class="header-anchor" href="#终止数据" aria-hidden="true">#</a> 终止数据</h3><p>如果此时Link在给PHY发数据，那么PHY可以拉高<strong>dir</strong>来终止Link的数据传输；</p><p>如果此时PHY在给Link发数据，那么Link可以拉高一个周期的<strong>stp</strong>来使PHY拉低<strong>dir</strong>信号，中断PHY的数据传输。并不是在所有情况下拉高<strong>stp</strong>都会使得PHY拉低<strong>dir</strong>，譬如当PHY时钟不稳时，其不能接受来自PHY的数据，此时即便<strong>stp</strong>拉高了，<strong>dir</strong>也不会拉低。</p><figure><img src="'+o+'" alt="lpi_abort_data" tabindex="0"><figcaption>lpi_abort_data</figcaption></figure><h1 id="utmi接口" tabindex="-1"><a class="header-anchor" href="#utmi接口" aria-hidden="true">#</a> UTMI接口</h1><blockquote><p>看ULPI看到一半，发现Xilinx提供的IP核不支持实现USB Host、OTG，寄。</p><p>那么目前可行的方案便是去看UTMI的规范，把<code>ultraembedded</code>的开源IP核搞明白是怎么一回事。</p><p>此外，根据前面的叙述，UTMI主要是叙述外设端的，UTMI+方才描述了主机端如何进行处理。</p></blockquote><h2 id="简介" tabindex="-1"><a class="header-anchor" href="#简介" aria-hidden="true">#</a> 简介</h2><p>ASIC专用集成电路中的门阵列，其频率只能跑到30~60MHz；但USB 2.0信号通常能跑到几百MHz。如果不加修改的使用传统VHDL编程，可能会很难。</p><p>有了UTMI接口后，ASIC厂商将UTMI接口留出，USB外设和IP厂商实现UTMI接口便可，而无需关注USB 2.0的细节。</p><p>下图以USB外设为例，将接下来要介绍的概念间的关系给展示了出来。可以看到从右向左分为三个部分：USB 2.0收发器(UTM，USB 2.0 Transceiver Macrocell)、串行接口引擎(SIE，Serial Interface Engine)、设备特定逻辑（Device Specific Logic）。</p><figure><img src="'+d+'" alt="asic_functional_blocks" tabindex="0"><figcaption>asic_functional_blocks</figcaption></figure><h3 id="usb-2-0收发器" tabindex="-1"><a class="header-anchor" href="#usb-2-0收发器" aria-hidden="true">#</a> USB 2.0收发器</h3><p>收发器处理底层的USB协议和信号，主要功能是将USB 2.0的时钟域转换成与ASIC的时钟频率相匹配的时钟域。（总之是一快一慢，中间搭个桥呗）</p><p>USB 2.0收发器支持的传输速率如下：</p><table><thead><tr><th>简称</th><th>全名</th><th>速度</th><th>原名</th></tr></thead><tbody><tr><td>HS</td><td><strong>USB 2.0</strong> High Speed</td><td>480 Mbit/s</td><td>USB 2.0</td></tr><tr><td>FS</td><td><strong>USB 2.0</strong> Full Speed</td><td>12 Mbit/s</td><td>USB 1.1</td></tr><tr><td>LS</td><td><strong>USB 2.0</strong> Low Speed</td><td>1.5 Mbit/s</td><td>USB 1.0</td></tr></tbody></table><blockquote><p>所以看到清华他们用的基于USB 1.1的IP核也不要大惊小怪了，毕竟现在都是USB 2.0</p></blockquote><p>UTMI支持三种模式：HS/FS、仅FS、仅LS。</p><blockquote><p>看了一圈文档，感觉High Speed好复杂啊...</p></blockquote><h3 id="串行接口引擎-sie" tabindex="-1"><a class="header-anchor" href="#串行接口引擎-sie" aria-hidden="true">#</a> 串行接口引擎（SIE）</h3><p>这个模块可以进一步细分为2种类型的子块：<strong>SIE控制逻辑</strong>（SIE Control Logic）和<strong>端点逻辑</strong>（Endpoint Logic）。SIE控制逻辑包含USB PID和地址识别逻辑，以及其他处理USB数据包和事务的排序和状态机逻辑。端点逻辑包含端点特定的逻辑：端点编号识别、FIFO和FIFO控制等。</p><p>一般来说，<strong>任何USB实现都需要SIE控制逻辑</strong>，而端点的数量和类型将根据应用和性能要求而变化。</p><h3 id="设备特定逻辑" tabindex="-1"><a class="header-anchor" href="#设备特定逻辑" aria-hidden="true">#</a> 设备特定逻辑</h3><p>就是自己写的设备罢。</p><h2 id="※utmi信号描述" tabindex="-1"><a class="header-anchor" href="#※utmi信号描述" aria-hidden="true">#</a> ※UTMI信号描述</h2><h3 id="系统接口信号" tabindex="-1"><a class="header-anchor" href="#系统接口信号" aria-hidden="true">#</a> 系统接口信号</h3><blockquote><p>Markdown对于表格支持还是有点差了，不列表了，一条一条说。</p><p>以下接口方向均是从PHY的角度出发来叙述的</p></blockquote><h4 id="clk" tabindex="-1"><a class="header-anchor" href="#clk" aria-hidden="true">#</a> CLK</h4><p><strong>时钟</strong> <strong>Output</strong> 上升沿有效</p><p><strong>CLK</strong>是接收和发送<strong>并行</strong>数据的时钟。不同的速度模式，对应着不同的频率。</p><table><thead><tr><th>频率</th><th>速度模式</th></tr></thead><tbody><tr><td>60 MHz</td><td>HS/FS, with 8-bit interface</td></tr><tr><td>30 MHz</td><td>HS/FS, with 16-bit interface</td></tr><tr><td>48 MHz</td><td>FS Only, with 8-bit interface</td></tr><tr><td>6 MHz</td><td>LS Only, with 8-bit interface</td></tr></tbody></table><h4 id="reset" tabindex="-1"><a class="header-anchor" href="#reset" aria-hidden="true">#</a> RESET</h4><p><strong>重置</strong> <strong>INPUT</strong> 高电平有效</p><p>会将UTM（对应USB 3500）中所有的状态机重置。</p><h4 id="xcvrselect" tabindex="-1"><a class="header-anchor" href="#xcvrselect" aria-hidden="true">#</a> XcvrSelect</h4><p><strong>收发器选择(Transceiver Select)</strong> <strong>INPUT</strong></p><p>当收发器模式为仅LS、仅FS时无效，亦即仅在FS/HS模式下有效。</p><p>0 - HS模式，1 - FS模式</p><h4 id="termselect" tabindex="-1"><a class="header-anchor" href="#termselect" aria-hidden="true">#</a> TermSelect</h4><p><strong>终止模式选择?(Termination Select)</strong> <strong>INPUT</strong></p><p>TermSelect控制一些与**终止(Termination)**有关的元素。HS、FS模式下的终止行为不太一样，因而要选择。</p><blockquote><p>“不太一样”指：In HS mode the FS Driver is forced to assert an SE0 on the USB, providing the 50 Ohm termination to ground and generating the HS Idle state on the bus. In FS Mode TermSelect enables the 1.5K pull-up on to the DP signal to generate the FS Idle state on the bus.</p></blockquote><p>当收发器模式为仅LS、仅FS时无效，亦即仅在FS/HS模式下有效。</p><p>0: HS termination enabled，1: FS termination enabled</p><h4 id="suspendm" tabindex="-1"><a class="header-anchor" href="#suspendm" aria-hidden="true">#</a> SuspendM</h4><p><strong>暂停</strong> <strong>INPUT</strong> <strong>低</strong>电平有效</p><p>将Macrocell置于从电源中消耗最小功率的模式。关闭所有不需要暂停/恢复操作的模块。<strong>当暂停时</strong>，<strong>TermSelect</strong>必须始终处于<strong>FS模式</strong>，以确保<strong>DP</strong>上的1.5K上拉值保持供电。</p><p>0: Macrocell circuitry drawing <strong>suspend</strong> current，1: Macrocell circuitry drawing <strong>normal</strong> current</p><h4 id="linestate-1-0" tabindex="-1"><a class="header-anchor" href="#linestate-1-0" aria-hidden="true">#</a> LineState[1:0]</h4><p><strong>线状态(Line State)</strong> <strong>OUTPUT</strong></p><p>线状态反映了**DP(LineState[0])<strong>和</strong>DM(LineState[1])**的状态。<strong>SIE会检测LineState信号</strong>，来进行复位、速度信号、数据包计时，以及从一个行为过渡到另一个行为。</p><p>They are combinatorial until a &quot;usable&quot; <strong>CLK</strong> is available then they are synchronized to CLK.（好像是说要等到<strong>CLK</strong>可用后，“他们”才会和<strong>CLK</strong>同步，否则与<strong>CLK</strong>不同步。）</p><table><thead><tr><th>DM</th><th>DP</th><th style="text-align:left;">描述</th></tr></thead><tbody><tr><td>0</td><td>0</td><td style="text-align:left;">0: SE0</td></tr><tr><td>0</td><td>1</td><td style="text-align:left;">1: &#39;J&#39; State</td></tr><tr><td>1</td><td>0</td><td style="text-align:left;">2: &#39;K&#39; State</td></tr><tr><td>1</td><td>1</td><td style="text-align:left;">3: SE1</td></tr></tbody></table><p><em>注：当数据包在USB上传输或接收时，若为FS模式，<strong>LineState</strong>信号可能在 &quot;J &quot;和 &quot;K &quot;状态之间随机切换；若为HS模式，将保持在 &quot;J &quot;状态。SIE应该忽略这些转换。</em></p><h5 id="同步-synchronization" tabindex="-1"><a class="header-anchor" href="#同步-synchronization" aria-hidden="true">#</a> 同步(Synchronization)</h5><p>为了最大限度地减少正常工作期间对SIE的不必要的转换，LineState在内部与<strong>CLK</strong>同步。</p><p>如果<strong>CLK</strong>不 &quot;可用&quot;(not usable)，那么<strong>LineState</strong>信号就不与<strong>CLK</strong>同步，而是直接用组合逻辑从<strong>DP</strong>和<strong>DM</strong>信号线驱动。</p><h5 id="信号层级-signaling-levels" tabindex="-1"><a class="header-anchor" href="#信号层级-signaling-levels" aria-hidden="true">#</a> 信号层级(Signaling Levels)</h5><p><strong>LineState</strong>信号用于在<strong>DP</strong>和<strong>DM</strong>上比较的电压阈值取决于<strong>XcvrSelect</strong>的状态。</p><p>【这一部分没怎么明白啊】</p><p>假设HS接收机将用于检测Chirp K或J，其中HS接收机的输出总是以 &quot;Squelch&quot;信号来限定。<strong>如果Squelch=1，那么HS接收器的输出就没有意义。</strong></p><blockquote><p>从哪里来的Squelch???</p></blockquote><p>对于HS，我们应该把<strong>XcvrSelect</strong>和<strong>TermSelect</strong>都打成0。如何解读<strong>LineState</strong>呢？</p><ul><li>当处于SE0状态（见上面的表）时，视为IDLE空闲态；（Squelch=0）</li><li>当处于J状态时，视为忙。（Squelch=1）</li></ul><h5 id="最小化变化-minimizing-transitions" tabindex="-1"><a class="header-anchor" href="#最小化变化-minimizing-transitions" aria-hidden="true">#</a> 最小化变化(Minimizing Transitions)</h5><p>在HS模式下，为了尽量减少<strong>LineState</strong>的转换，当Squelch=1时使<strong>LineState</strong>进入J状态(IDLE)。</p><p>这样一来，当USB上有数据包时，让<strong>LineState</strong>指示J状态，从而满足当USB上有活动时就发生<strong>LineState</strong>转换的要求，同时尽量减少总线上有数据时<strong>LineState</strong>转换的次数。使用<strong>TermSelect</strong>，而不是<strong>XcvrSelect</strong>，可以在启用该模式前完成Speed Chirp协议。</p><h5 id="总线包时间-bus-packet-timing" tabindex="-1"><a class="header-anchor" href="#总线包时间-bus-packet-timing" aria-hidden="true">#</a> 总线包时间(Bus Packet Timing)</h5><p>SIE通过<strong>LineState</strong>来判断总线上数据传输的开始和结束。当<strong>XcvrSelect</strong>和<strong>TermSelect</strong>处于HS模式时，<strong>LineState</strong>从空闲状态（SE0）转换到非空闲状态（J）标志着总线上数据包的<strong>开始</strong>。<strong>LineState</strong>从非空闲状态（J）过渡到空闲状态（SE0）标志着总线上的数据包<strong>结束</strong>。</p><h4 id="opmode-1-0" tabindex="-1"><a class="header-anchor" href="#opmode-1-0" aria-hidden="true">#</a> OpMode[1:0]</h4><p><strong>操作模式(Operational Mode)</strong> <strong>INPUT</strong></p><p>通过信号选择不同的模式。</p><table><thead><tr><th>[1]</th><th>[0]</th><th style="text-align:left;">Description</th></tr></thead><tbody><tr><td>0</td><td>0</td><td style="text-align:left;">0: Normal Operation</td></tr><tr><td>0</td><td>1</td><td style="text-align:left;">1: Non-Driving</td></tr><tr><td>1</td><td>0</td><td style="text-align:left;">2: Disable Bit Stuffing and NRZI encoding</td></tr><tr><td>1</td><td>1</td><td style="text-align:left;">3: Reserved</td></tr></tbody></table><p>When a device generates resume signaling to the host, it switches the OpMode to &quot;Disable Bit Stuffing and NRZI Encoding&quot;, asserts TXValid, and presents the data on the DataOut bus. The assertion of OpMode to “Normal” mode at the end of the 1 ms signaling period should occur until after the maximum TX End Delay (TXValid has been de-asserted for at least 40 bit times or in FS mode 160 CLKs). See section 0 for a discussion of TX End Delay. SIE designers note: if OpMode switched to “Normal” mode before the maximum TX End Delay completes, then there is the possibility that the last data still pending in the UTM will be NRZI encoded and bit stuffed (in case 6 1&#39;s occur), resulting in K and J transitions on the DP/DM signal lines at the end of resume from the device. At this time the downstream facing port will also be propagating back the K state (detected device resume) onto all enabled down stream ports. This creates bus conflict on DP/DM.</p><h1 id="utmi-接口叙述" tabindex="-1"><a class="header-anchor" href="#utmi-接口叙述" aria-hidden="true">#</a> UTMI+接口叙述</h1><blockquote><p>如前所说，UTMI虽然给出了接口，但是并没有说USB Host/OTG设备怎么实现。于是便有了UTMI+接口。</p></blockquote><h2 id="utmi-的各个层次" tabindex="-1"><a class="header-anchor" href="#utmi-的各个层次" aria-hidden="true">#</a> UTMI+的各个层次</h2><p>要接的外设不同，实现USB Host/OTG的复杂程度也不同。UTMI+有4个层次，从低到高实现的功能越来越多（当然也越来越复杂）。同时，高层次要对低层次兼容。</p><p>USB3500实现了最高一层，即UTMI+ level 3。</p><figure><img src="'+h+'" alt="utmi_plus_levels" tabindex="0"><figcaption>utmi_plus_levels</figcaption></figure>',116),p=[l];function c(u,S){return e(),r("div",null,p)}const f=t(g,[["render",c],["__file","utmi_ulpi.html.vue"]]);export{f as default};
