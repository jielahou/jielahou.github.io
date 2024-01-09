import{_ as o,F as i,W as r,X as c,Y as n,Z as e,a0 as s,$ as a}from"./framework-c1077caf.js";const l={},p={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#performance-guidelines",target:"_blank",rel:"noopener noreferrer"},d=n("p",null,"内容有些杂、有些乱，主要是自己学习用的，请谅解！",-1),u=a('<h2 id="优化策略概览" tabindex="-1"><a class="header-anchor" href="#优化策略概览" aria-hidden="true">#</a> 优化策略概览</h2><blockquote><p>Performance optimization revolves around four basic strategies:</p><ul><li>Maximize parallel execution to achieve maximum utilization;</li><li>Optimize memory usage to achieve maximum memory throughput;</li><li>Optimize instruction usage to achieve maximum instruction throughput;</li><li>Minimize memory thrashing.</li></ul></blockquote><p>性能优化围绕四个基本策略展开：</p><ul><li><p><strong>最大化并行执行</strong>，实现最大利用率；</p></li><li><p><strong>优化内存使用</strong>，实现最大内存吞吐量；</p></li><li><p><strong>优化指令使用</strong>，实现最大指令吞吐量；</p></li><li><p><strong>尽量减少内存抖动</strong></p></li></ul><div class="hint-container info"><p class="hint-container-title">内存抖动</p><p>内存抖动应该是指内存页面频繁的换入换出</p></div><blockquote><p>Which strategies will yield the best performance gain for a particular portion of an application depends on the performance limiters for that portion; optimizing instruction usage of a kernel that is mostly limited by memory accesses will not yield any significant performance gain, for example. Optimization efforts should therefore be constantly directed by measuring and monitoring the performance limiters, for example using the CUDA profiler. Also, comparing the floating-point operation throughput or memory throughput—whichever makes more sense—of a particular kernel to the corresponding peak theoretical throughput of the device indicates how much room for improvement there is for the kernel.</p></blockquote><p>对于应用程序的特定部分， 哪种优化策略能取得最大的性能提升， 取决于<strong>到底是哪部分限制住了性能</strong>；例如， 对受内存访问限制的内核进行指令上的优化， 不会带来任何显著的性能提升。 因此， 应<strong>通过测量和监控</strong>（例如使用 CUDA profiler），去<strong>发现性能限制因素</strong>，再来不断指导优化工作。 此外， 将特定内核的浮点运算吞吐量或内存吞吐量（以更合理的方式为准） 与相应设备的理论峰值吞吐量进行比较，可以显示内核的改进空间有多大。</p><h2 id="最大化利用率" tabindex="-1"><a class="header-anchor" href="#最大化利用率" aria-hidden="true">#</a> 最大化利用率</h2><blockquote><p>To maximize utilization the application should be structured in a way that it exposes as much parallelism as possible and efficiently maps this parallelism to the various components of the system to keep them busy most of the time.</p></blockquote><p>为了最大限度地提高利用率， 应用程序的结构应尽可能多地<strong>暴露出并行性</strong>， 并有效地<strong>将这种并行性映射到系统的各个组件上</strong>，使它们在大部分时间内都处于忙碌状态。</p><h3 id="应用层面" tabindex="-1"><a class="header-anchor" href="#应用层面" aria-hidden="true">#</a> 应用层面</h3>',11),h=n("strong",null,"using asynchronous functions calls and streams",-1),m={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution",target:"_blank",rel:"noopener noreferrer"},g=a('<p>在高层次上， 应用程序应通过使用==<strong>异步函数调用和流机制</strong>==（如异步并发执行中所述），最大限度地提高主机、 设备以及连接主机和设备的总线之间的并行执行能力。 它应为每个处理器分配其最擅长的工作类型：串行工作负载分配给主机；并行工作负载分配给设备。</p><blockquote><p>For the parallel workloads, at points in the algorithm where parallelism is broken because some threads need to synchronize in order to share data with each other, there are two cases: Either these threads belong to the same block, in which case they should use <code>__syncthreads()</code> and share data through shared memory within the same kernel invocation, or they belong to different blocks, in which case they must share data through global memory using two separate kernel invocations, one for writing to and one for reading from global memory. The second case is much less optimal since it adds the overhead of extra kernel invocations and global memory traffic. Its occurrence should therefore be minimized by mapping the algorithm to the CUDA programming model in such a way that the computations that require inter-thread communication are performed within a single thread block as much as possible.</p></blockquote><p>对于并行工作负载，在算法中由于<strong>某些线程需要同步以相互共享数据而导致并行性中断</strong>的地方，<strong>有两种情况</strong>：<strong>要么这些线程属于同一个Block</strong>，在这种情况下，它们应该使用<code>syncthreads()</code>并在同一个内核调用中<strong>通过共享存储器</strong>共享数据；<strong>要么它们属于不同的区块</strong>，在这种情况下，它们必须<strong>调用两个单独的内核通过全局存储器</strong>共享数据，一个用于写入全局内存，另一个用于从全局内存读取数据。第二种情况并不理想，因为它会增加额外的内核调用和全局存储器流量。因此，在将算法映射到CUDA编程模型时，线程间若需要需要通信，应尽可能<strong>在单个线程块内执行计算</strong>，从而最大限度地减少这种情况的发生。</p><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>总结：</p><ul><li>异步函数调用和流机制</li><li>当线程间需要通信时，尽量在单个线程块内执行</li></ul></div><h3 id="设备层面" tabindex="-1"><a class="header-anchor" href="#设备层面" aria-hidden="true">#</a> 设备层面</h3><blockquote><p>At a lower level, the application should maximize parallel execution between the multiprocessors of a device.</p></blockquote><p>在较低层次上，应用程序应最大限度地在设备的多处理器之间并行执行。</p>',7),k={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution",target:"_blank",rel:"noopener noreferrer"},_=a('<p>一个设备上可同时执行多个内核，因此，如异步并发执行中所述，使用流机制使足够多的内核同时执行，也可实现最大利用率。</p><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>总结：使用流机制让内核并行</p></div><h3 id="sm层面" tabindex="-1"><a class="header-anchor" href="#sm层面" aria-hidden="true">#</a> SM层面</h3><blockquote><p>At an even lower level, the application should <strong>maximize parallel execution between the various functional units</strong> within a multiprocessor.</p></blockquote><p>在更低的层次上，应用程序应最大限度地利用<strong>多处理器内各功能单元之间的并行执行</strong>。</p>',5),f={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading",target:"_blank",rel:"noopener noreferrer"},b={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture-notes",target:"_blank",rel:"noopener noreferrer"},v=n("em",null,"latency",-1),y={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#arithmetic-instructions",target:"_blank",rel:"noopener noreferrer"},x={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#hardware-multithreading",target:"_blank",rel:"noopener noreferrer"},w=n("strong",null,"主要依靠线程级并行",-1),C=n("strong",null,"利用同一 warp 的另一条独立指令（指令级并行性）",-1),z=n("strong",null,"利用另一个 warp 的指令（线程级并行性）",-1),A={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#simt-architecture-notes",target:"_blank",rel:"noopener noreferrer"},M=n("strong",null,[e("线程束准备好执行下一条指令所需的时钟周期数称为"),n("em",null,"延迟")],-1),P={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#arithmetic-instructions",target:"_blank",rel:"noopener noreferrer"},E={class:"hint-container info"},q=n("p",{class:"hint-container-title"},"吞吐量",-1),B={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#maximize-instruction-throughput",target:"_blank",rel:"noopener noreferrer"},D=n("strong",null,[n("mark",null,"吞吐量"),n("strong",null,"是指 对于某指定操作 每个SM、每个时钟周期"),e("能够执行该操作的次数")],-1),H=n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mi",null,"N")]),n("annotation",{encoding:"application/x-tex"},"N")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"0.6833em"}}),n("span",{class:"mord mathnormal",style:{"margin-right":"0.10903em"}},"N")])])],-1),N=n("mark",null,"指令吞吐量",-1),U=n("span",{class:"katex"},[n("span",{class:"katex-mathml"},[n("math",{xmlns:"http://www.w3.org/1998/Math/MathML"},[n("semantics",null,[n("mrow",null,[n("mo",{stretchy:"false"},"("),n("mi",null,"N"),n("mi",{mathvariant:"normal"},"/"),n("mn",null,"32"),n("mo",{stretchy:"false"},")")]),n("annotation",{encoding:"application/x-tex"},"(N/32)")])])]),n("span",{class:"katex-html","aria-hidden":"true"},[n("span",{class:"base"},[n("span",{class:"strut",style:{height:"1em","vertical-align":"-0.25em"}}),n("span",{class:"mopen"},"("),n("span",{class:"mord mathnormal",style:{"margin-right":"0.10903em"}},"N"),n("span",{class:"mord"},"/32"),n("span",{class:"mclose"},")")])])],-1),L=n("mark",null,"指令",-1),I=n("p",null,"所有的吞吐量都是针对一个SM而言的。在计算整个设备的吞吐量时，需要将吞吐量乘上该设备拥有的SM个数。",-1),W=n("p",null,"至于上文提到的“假定指令吞吐量最大”，个人认为指的是 能够打满相关的执行单元。",-1),j=n("em",null,"4L",-1),T={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capabilities",target:"_blank",rel:"noopener noreferrer"},G=n("ul",null,[n("li",null,"一个SM 在一个时钟周期 为4个线程束中每个线程束 发射一条指令，共发射4条指令"),n("li",null,"即：一个SM 在一个时钟周期 会发射4条指令")],-1),S=n("li",null,[n("em",null,"2L"),e(" for devices of compute capability 6.0 since for these devices, the two instructions issued every cycle are one instruction for two different warps. "),n("ul",null,[n("li",null,"对于计算能力6.0的设备"),n("li",null,"一个周期发射两条指令，这两条指令来自不同的线程束。")])],-1),F=a('<blockquote><p>The most common reason a warp is not ready to execute its next instruction is that the instruction’s input operands are not available yet.</p></blockquote><p>线程束之所以尚未准备好执行下一条指令，最常见的原因是指令的输入操作数还没准备好。</p><p><mark>还有很多，鸽了</mark></p><h2 id="最大化内存吞吐量" tabindex="-1"><a class="header-anchor" href="#最大化内存吞吐量" aria-hidden="true">#</a> 最大化内存吞吐量</h2><p>减少低带宽的数据传输，即减少主机和设备之间的数据传输、即减少全局存储器和设备之间的数据传输（=&gt;善用<strong>共享存储器</strong>和各种Cache）。</p><p><strong>共享存储器</strong>相当于<strong>用户管理的高速缓存</strong>： 应用程序<strong>明确分配和访问</strong>它。</p><p>片上内存既用于 L1 ，也用于共享内存；片上内存有多少分给 L1 、多少分给共享内存，在每次内核调用时可以进行配置。</p>',7),O={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#device-memory-accesses",target:"_blank",rel:"noopener noreferrer"},R=n("strong",null,"最佳内存访问模式",-1),V=a('<div class="hint-container info"><p class="hint-container-title">小结</p><ol><li>使用共享存储器</li><li>使用最佳内存访问模式</li></ol></div><h3 id="主机和设备之间的数据传输" tabindex="-1"><a class="header-anchor" href="#主机和设备之间的数据传输" aria-hidden="true">#</a> 主机和设备之间的数据传输</h3><p>若要减少主机和设备之间的数据传输，（如果有些工作主机和设备都能做，那么）可以让设备执行更多的代码（而不是在主机上执行，虽然这可能会降低设备代码的并行性）。如此一来，<strong><mark>中间数据结构可在设备内存中创建</mark></strong>，由设备操作并销毁，而无需由主机映射或复制到主机内存中。</p><p>此外，由于<strong>每次传输都会产生开销</strong>，因此将**<mark>许多小传输批量合并为一次大传输</mark>**，总比单独进行每次传输要好。</p>',4),X=n("mark",null,"锁页内存",-1),Z=n("code",null,"cudaHostAlloc",-1),K=n("code",null,"cudaHostFree",-1),Y={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#page-locked-host-memory",target:"_blank",rel:"noopener noreferrer"},$=n("strong",null,"between page-locked host memory and device memory can be performed concurrently",-1),J={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#asynchronous-concurrent-execution",target:"_blank",rel:"noopener noreferrer"},Q=n("ul",null,[n("li",null,[n("mark",null,"？？复制并行执行？？")])],-1),nn=n("strong",null,"page-locked host memory can be mapped into the address space of the device",-1),en={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#mapped-memory",target:"_blank",rel:"noopener noreferrer"},tn=n("strong",null,"主机上的锁页内存可以映射到设备的地址空间中",-1),sn=n("strong",null,"设备可以直接访问主机内存",-1),an={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#mapped-memory",target:"_blank",rel:"noopener noreferrer"},on=n("li",null,"如果主存中的数据只被访问1次，那么直接从主存中映射访问要比开一块全局存储器，从主存搬运到全局存储器要快。",-1),rn=n("li",null,[n("strong",null,"准确来说，零拷贝并不是无需拷贝，而是无需显式拷贝"),e("。使用零拷贝内存时不需要cudaMemcpy之类的显式拷贝操作，直接通过指针取值，所以对调用者来说似乎是没有拷贝操作。但实际上是在引用内存中某个值时隐式走PCIe总线拷贝，这样的方式有几个优点： "),n("ul",null,[n("li",null,[e("无需所有数据一次性显式拷贝到设备端，而是"),n("strong",null,"引用某个数据时即时隐式拷贝")]),n("li",null,[e("隐式拷贝是"),n("strong",null,"异步"),e("的，可以和计算并行，隐藏内存传输延时")])])],-1),cn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#write-combining-memory",target:"_blank",rel:"noopener noreferrer"},ln=n("ul",null,[n("li",null,"对于有前端总线（指连接北桥的总线），使用锁页内存能够取得更高的性能。")],-1),pn=n("p",null,"也有部分设备，其显存和主机内存物理上是同一块。此时用映射内存更好。可通过相关API查询。",-1),dn=n("code",null,"cudaHostAlloc",-1),un={href:"https://zhuanlan.zhihu.com/p/188246455",target:"_blank",rel:"noopener noreferrer"},hn=n("ul",null,[n("li",null,"cudaHostAllocDefault 默认值，等同于cudaMallocHost。"),n("li",null,"cudaHostAllocPortable 分配所有GPU都可使用的锁页内存"),n("li",null,"cudaHostAllocMapped。 此标志下分配的锁页内存可实现零拷贝功能，主机端和设备端各维护一个地址，通过地址直接访问该块内存，无需传输。"),n("li",null,"cudaHostAllocWriteCombined 将分配的锁页内存声明为write-combined写联合内存，此类内存不使用L1 和L2 cache，所以程序的其它部分就有更多的缓存可用。此外，write-combined内存通过PCIe传输数据时不会被监视，能够获得更高的传输速度。因为没有使用L1、L2cache， 所以主机读取write-combined内存很慢，write-combined适用于主机端写入、设备端读取的锁页内存。")],-1),mn=a('<div class="hint-container info"><p class="hint-container-title">小结</p><p>减少主机内存和显存之间通信的方法：</p><ol><li>让设备干活！让中间数据存在设备上</li><li>许多小传输批量合并为一次大传输</li><li>使用锁页内存、零拷贝内存</li></ol></div><h3 id="设备内存访问" tabindex="-1"><a class="header-anchor" href="#设备内存访问" aria-hidden="true">#</a> 设备内存访问</h3><p>一条访存指令可能会被发射很多很多次！要发射多少次，取决于一个线程束内 各个线程访存地址的分布情况。这种分布方式对指令吞吐量的影响和内存的类型相关，将在下面的章节中进行说明。例如，对于全局存储器，一般来说，<strong>地址越分散，吞吐量就越降低</strong>。</p><h4 id="全局存储器" tabindex="-1"><a class="header-anchor" href="#全局存储器" aria-hidden="true">#</a> 全局存储器</h4><p>全局存储器通过32、64、128<strong>字节</strong>（不是位！）的<strong>内存事务</strong>进行访问。访问时需对齐。</p><p>当一个线程束在访问内存时，会根据其<strong>内部每个线程所需要访存的大小</strong>、<strong>访存地址的分布</strong>对访存进行<strong>合并</strong>，<strong>合并成若干内存事务</strong>。一般来说，需要的事务越多，传输中没有什么用的字也就越多，从而相应地降低了指令吞吐量。例如，如果每个线程的 4 字节访问要产生 32 字节的内存事务，吞吐量就要除以 8。（1次32字节的内存事务，会访问32字节，但其中只有4字节是我需要的）</p>',6),gn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-5-x",target:"_blank",rel:"noopener noreferrer"},kn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-6-x",target:"_blank",rel:"noopener noreferrer"},_n={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-7-x",target:"_blank",rel:"noopener noreferrer"},fn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-8-x",target:"_blank",rel:"noopener noreferrer"},bn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-9-0",target:"_blank",rel:"noopener noreferrer"},vn=a(`<p>若要<strong>最大化全局存储器的吞吐量</strong>，就要<strong>想方设法尽量去合并访存</strong>：</p><ul><li>根据设备的计算能力，找到最合适的访存模式</li><li>使用符合大小和对齐要求的数据结构</li><li>在一些情况下填充数据</li></ul><h4 id="大小和对齐要求" tabindex="-1"><a class="header-anchor" href="#大小和对齐要求" aria-hidden="true">#</a> 大小和对齐要求</h4><p>可以使用<code>__align__(X)</code>关键字</p><h4 id="二维数组" tabindex="-1"><a class="header-anchor" href="#二维数组" aria-hidden="true">#</a> 二维数组</h4><p>Thread Index为<code>(tx,ty)</code>的线程，若要访问一个宽度为<code>Width</code>的二维数组，访问数组中如下地址较好：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>BaseAddress + width * ty + tx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>备注：也是让<code>tx</code>相邻的线程访问相邻的元素，合并同Warp内的内存访问</p></blockquote><p>为了让二维数组中的一行元素的个数为32（线程束中线程个数）的倍数（以进一步合并访存），可以通过<code>cudaMallocPitch()</code> and <code>cuMemAllocPitch()</code>等函数帮我们自动做padding。</p>`,9),yn={href:"https://zhuanlan.zhihu.com/p/490239617",target:"_blank",rel:"noopener noreferrer"},xn=a(`<p><strong>分配内存</strong></p><p>二维数组实际上也是连续的空间，但是进行了内存对齐。一行的有效宽度为<code>Width</code>，在内存中的实际宽度为<code>Pitch</code>。<em><code>Width</code>和<code>Pitch</code>的单位都是Byte</em> 。</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token comment">// CPU分配--使用一维数组</span>
<span class="token keyword">float</span> <span class="token operator">*</span>N_h <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">float</span> <span class="token punctuation">[</span>Width <span class="token operator">*</span> Height<span class="token punctuation">]</span><span class="token punctuation">;</span><span class="token comment">//pitch == width</span>
<span class="token comment">// GPU内存分配</span>
<span class="token keyword">float</span> <span class="token operator">*</span>N_d<span class="token punctuation">;</span> 
size_t Pitch<span class="token punctuation">;</span>
<span class="token function">cudaMallocPitch</span><span class="token punctuation">(</span><span class="token operator">&amp;</span>N_d<span class="token punctuation">,</span> <span class="token operator">&amp;</span>Pitch<span class="token punctuation">,</span> Width<span class="token operator">*</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token punctuation">)</span><span class="token punctuation">,</span> Height<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>初始化</strong></p><p>初始化需要将数组从CPU拷贝上GPU，使用<code>cudaMemcpy2D()</code>函数。函数原型为</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>__host__cudaError_t cudaMemcpy2D (void *dst, size_t dpitch, const void *src, size_t spitch, size_t width, size_t height, cudaMemcpyKind kind)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>它将一个Host（CPU）上的二维数组，拷贝到Device（GPU）上。CPU和GPU上的二维数组，都<em><strong>存储成C语言一维数组形式。</strong></em></p><p>参数分别表示</p><ul><li>dst：Device上的数组指针</li><li>dpitch：Device上二维数组的Pitch（一行在内存中的实际宽度）。<strong>单位Byte</strong></li><li>src：Host上的数组指针</li><li>spitch：Host上二维数组的Pitch（一行在内存中的实际宽度）。<strong>单位Byte</strong></li><li>width：二维数组一行的宽度（逻辑上的宽度）。<strong>单位Byte</strong></li><li>height：二维数组的 <em>行数。</em></li><li>kind：数据迁移的类别，如 <code>cudaMemcpyHostToDevice</code></li></ul><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token comment">// 将数据从CPU迁移到GPU</span>
<span class="token function">cudaMemcpy2D</span><span class="token punctuation">(</span>N_d<span class="token punctuation">,</span> Pitch<span class="token punctuation">,</span> N_h<span class="token punctuation">,</span> Width<span class="token operator">*</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token punctuation">)</span><span class="token punctuation">,</span> Width<span class="token operator">*</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token punctuation">)</span><span class="token punctuation">,</span> Height<span class="token punctuation">,</span> cudaMemcpyHostToDevice<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>访问</strong></p><p><em>CUDA C Programming Guide</em> 中给出的访问方式如下所示</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token comment">// 二维数组的访问</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>i<span class="token operator">&lt;</span>Height<span class="token punctuation">;</span>i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">float</span> <span class="token operator">*</span>row <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">float</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">char</span><span class="token operator">*</span><span class="token punctuation">)</span>N<span class="token operator">+</span>i<span class="token operator">*</span>Pitch<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>j<span class="token operator">&lt;</span>Width<span class="token punctuation">;</span>j<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        row<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>Pitch</code> 是一行所占的字节数， 先将指针<code>N</code> 强制转化为<code>char*</code>（char 占1Byte，float占3Byte）， 在向后移动<code>Pitch</code>个字节，得到<code>(char*)N+1*Pitch</code> ，它是第1行（从0计数）的首地址；再将它转换回<code>float*</code>，就可以通过这个指针（<code>row</code>） 来访问第1行。</p><p>也正因为<code>Pitch</code>是以字节计数的，所以以下这种索引方式是错误的</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token comment">/* 不可以使用以下语句 */</span>
<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>i<span class="token operator">&lt;</span>Height<span class="token punctuation">;</span>i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>j<span class="token operator">&lt;</span>Width<span class="token punctuation">;</span>j<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        N<span class="token punctuation">[</span>i<span class="token operator">*</span>N_pitch_d<span class="token operator">+</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>正确写法应该是：</p><div class="language-cpp line-numbers-mode" data-ext="cpp"><pre class="language-cpp"><code><span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>i<span class="token operator">&lt;</span>Height<span class="token punctuation">;</span>i<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j<span class="token operator">=</span><span class="token number">0</span><span class="token punctuation">;</span>j<span class="token operator">&lt;</span>Width<span class="token punctuation">;</span>j<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        N<span class="token punctuation">[</span>i<span class="token operator">*</span>N_pitch_d<span class="token operator">/</span><span class="token keyword">sizeof</span><span class="token punctuation">(</span><span class="token keyword">float</span><span class="token punctuation">)</span><span class="token operator">+</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,18),wn=a('<h4 id="局部存储器" tabindex="-1"><a class="header-anchor" href="#局部存储器" aria-hidden="true">#</a> 局部存储器</h4><p>虽然编译器一般会将会将 不使用标识符（如<code>__shared__</code>等）声明出的变量 分配到寄存器中，但是也有少数情况会放在局部存储器（Local Memory）中：</p><ul><li>==无法确定以常量为索引的数组?==没看懂啥意思、 <ul><li>Arrays for which it cannot determine that they are indexed with constant quantities</li></ul></li><li>会<strong>占用过多</strong>寄存器空间的大型结构或数组、</li><li>内核使用的寄存器数目<strong>超过了可用</strong>的寄存器数目（这也被称为寄存器溢出）。</li></ul><p>如何确定变量是不是使用了局部存储器？</p><ul><li>查看汇编出来的<code>ptx</code>： <ul><li>以<code>.local</code>助记符声明</li><li>以<code>ld.local</code>、<code>st.local</code>访存</li></ul></li><li>查看最终编译出的<code>cubin</code>： <ul><li>即便<code>ptx</code>没有体现local，有可能在针对设备最终编译时，会决定放入局部存储器</li><li><code>cuobjdump</code></li></ul></li><li><code>--ptxas-options=-v</code>选项</li></ul><h4 id="共享存储器" tabindex="-1"><a class="header-anchor" href="#共享存储器" aria-hidden="true">#</a> 共享存储器</h4><p>共享存储器被组织为若干Bank。如果一次请求落在了不同的Bank，这些请求可以被同时处理。如果一次请求落在了相同的Bank，这些请求必须依次串行处理。</p>',7),Cn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-5-x",target:"_blank",rel:"noopener noreferrer"},zn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-6-x",target:"_blank",rel:"noopener noreferrer"},An={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-7-x",target:"_blank",rel:"noopener noreferrer"},Mn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-8-x",target:"_blank",rel:"noopener noreferrer"},Pn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-9-0",target:"_blank",rel:"noopener noreferrer"},En={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#compute-capability-5-x",target:"_blank",rel:"noopener noreferrer"},qn=a('<h4 id="常量存储器" tabindex="-1"><a class="header-anchor" href="#常量存储器" aria-hidden="true">#</a> 常量存储器</h4><p>常量存储器空间位于设备内存中，并在常量缓存中缓存。</p><p>然后，一个请求会根据初始请求中不同的内存地址被拆分成多个单独的请求，吞吐量的下降系数等于单独请求的数量。</p><p>如果<strong>缓存命中</strong>，则按照<strong>常量缓存的吞吐量</strong>为由此产生的请求提供服务；反之，则按照设备内存的吞吐量提供服务。</p><h4 id="纹理和表面存储器" tabindex="-1"><a class="header-anchor" href="#纹理和表面存储器" aria-hidden="true">#</a> 纹理和表面存储器</h4><p>纹理和曲面内存空间位于设备内存中，并缓存在纹理缓存中，因此<strong>只有在缓存未命中时</strong>，纹理获取或曲面读取才会<strong>花费一次从设备内存读取的代价</strong>，否则只需花费<strong>一次从纹理缓存读取内存的代价</strong>。纹理缓存针对 2D 空间位置进行了优化，因此读取纹理或曲面地址的同一线程束如果在 2D 中相距很近，就能获得最佳性能。此外，纹理缓存是为具有恒定延迟的流式读取而设计的；缓存命中会减少 DRAM 带宽需求，但不会减少读取延迟。</p><p>通过纹理或曲面获取读取设备内存<strong>具有一些优势</strong>，可以使其成为从全局存储器或常量存储器读取设备内存的有利替代方案：</p><ul><li><p>如果内存读取不遵循为获得良好性能而必须遵循的全局或常量存储器读取的访问模式（指<strong>没有合并访存</strong>），那么只要<strong>对纹理存储器或表面存储器的访问具有局部性</strong>，就可以获得更高的带宽；</p></li><li><p><strong>寻址计算由专用单元在内核外执行</strong>；</p></li><li><p>打包数据可在一次操作中广播到不同的变量；</p></li><li><p>8 位和 16 位整数输入数据可选择转换为范围为 [0.0, 1.0] 或 [-1.0, 1.0] 的 32 位浮点数值（参见纹理内存）。</p></li></ul><h2 id="最大化指令吞吐量" tabindex="-1"><a class="header-anchor" href="#最大化指令吞吐量" aria-hidden="true">#</a> 最大化指令吞吐量</h2><p>欲最大化指令吞吐量，我们应该这么做：</p>',10),Bn=n("strong",null,"Minimize the use of arithmetic instructions with low throughput;",-1),Dn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#intrinsic-functions",target:"_blank",rel:"noopener noreferrer"},Hn=n("li",null,"一些内建函数（我也不知道咋翻译好了，感觉就是用特殊计算单元而非常规计算单元的函数）",-1),Nn=n("li",null,"单精度而不是双精度",-1),Un={href:"https://zh.wikipedia.org/wiki/IEEE_754#%E9%9D%9E%E8%A7%84%E7%BA%A6%E5%BD%A2%E5%BC%8F%E7%9A%84%E6%B5%AE%E7%82%B9%E6%95%B0",target:"_blank",rel:"noopener noreferrer"},Ln=n("code",null,"-ftz=true",-1),In={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#control-flow-instructions",target:"_blank",rel:"noopener noreferrer"},Wn=n("ul",null,[n("li",null,"同一个Warp内的32个线程尽量不在分支指令处“分叉”")],-1),jn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#synchronization-instruction",target:"_blank",rel:"noopener noreferrer"},Tn={href:"https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#restrict",target:"_blank",rel:"noopener noreferrer"},Gn=n("strong",null,"restrict",-1),Sn=n("ul",null,[n("li",null,"减少同步指令"),n("li",null,[e("使用"),n("code",null,"__restrict__"),e("指针")])],-1),Fn=n("p",null,"可以使用如下的编译标志：",-1),On=n("code",null,"-ftz=true",-1),Rn=n("code",null,"-ftz=false",-1),Vn={href:"https://zh.wikipedia.org/wiki/IEEE_754#%E9%9D%9E%E8%A7%84%E7%BA%A6%E5%BD%A2%E5%BC%8F%E7%9A%84%E6%B5%AE%E7%82%B9%E6%95%B0",target:"_blank",rel:"noopener noreferrer"},Xn=a("<li>Similarly, code compiled with <code>-prec-div=false</code> (less precise division) tends to have higher performance code than code compiled with <code>-prec-div=true</code>, <ul><li>不使用高精度除法</li></ul></li><li>and code compiled with <code>-prec-sqrt=false</code> (less precise square root) tends to have higher performance than code compiled with <code>-prec-sqrt=true</code>. The nvcc user manual describes these compilation flags in more details. <ul><li>不使用高精度平方根</li></ul></li>",2);function Zn(Kn,Yn){const t=i("ExternalLinkIcon");return r(),c("div",null,[n("blockquote",null,[n("p",null,[e("本章原文："),n("a",p,[e("https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#performance-guidelines"),s(t)])]),d]),u,n("blockquote",null,[n("p",null,[e("At a high level, the application should maximize parallel execution between the host, the devices, and the bus connecting the host to the devices, by "),h,e(" as described in "),n("a",m,[e("Asynchronous Concurrent Execution"),s(t)]),e(". It should assign to each processor the type of work it does best: serial workloads to the host; parallel workloads to the devices.")])]),g,n("blockquote",null,[n("p",null,[e("Multiple kernels can execute concurrently on a device, so maximum utilization can also be achieved by using streams to enable enough kernels to execute concurrently as described in "),n("a",k,[e("Asynchronous Concurrent Execution"),s(t)]),e(".")])]),_,n("blockquote",null,[n("p",null,[e("As described in "),n("a",f,[e("Hardware Multithreading"),s(t)]),e(", a GPU multiprocessor primarily relies on thread-level parallelism to maximize utilization of its functional units. Utilization is therefore directly linked to the number of resident warps. At every instruction issue time, a warp scheduler selects an instruction that is ready to execute. This instruction can be another independent instruction of the same warp, exploiting instruction-level parallelism, or more commonly an instruction of another warp, exploiting thread-level parallelism. If a ready to execute instruction is selected it is issued to the "),n("a",b,[e("active"),s(t)]),e(" threads of the warp. The number of clock cycles it takes for a warp to be ready to execute its next instruction is called the "),v,e(", and full utilization is achieved when all warp schedulers always have some instruction to issue for some warp at every clock cycle during that latency period, or in other words, when latency is completely “hidden”. The number of instructions required to hide a latency of L clock cycles depends on the respective throughputs of these instructions (see "),n("a",y,[e("Arithmetic Instructions"),s(t)]),e(" for the throughputs of various arithmetic instructions). If we assume instructions with maximum throughput, it is equal to:")])]),n("p",null,[e("如"),n("a",x,[e("硬件多线程"),s(t)]),e("所述，GPU 多处理器"),w,e("来最大限度地利用其功能单元。因此，利用率与常驻的线程束数量直接相关。在每条指令发出时，线程束调度器都会选择一条准备执行的指令。这条指令可以是"),C,e("，也可以是"),z,e("。如果选择了一条准备执行的指令，它就会被发射给该 warp 的"),n("a",A,[e("活跃"),s(t)]),e("线程。"),M,e("，当所有线程束调度器在该延迟期内的每个时钟周期都要为一些线程束发射指令时，或者换句话说，当"),n("strong",null,[e('延迟被完全 "隐藏"'),n("strong",null,[e("时，就实现了充分利用。隐藏 L 个时钟周期的延迟所需的指令数取决于这些指令各自的吞吐量（各种算术指令的吞吐量参见 "),n("a",P,[e("算术指令"),s(t)]),e("）。如果假定指令的")]),e("吞吐量")]),e("最大，则等于：")]),n("div",E,[q,n("p",null,[e("关于吞吐量定义可见"),n("a",B,[e("这里"),s(t)]),e("。"),D,e("。对于32个线程组成的线程束，一条指令会对应32次操作；所以如果"),H,e("是每个时钟周期执行操作的次数，那么**"),N,e("就是每个周期"),U,e("条"),L,e("**。")]),I,W]),n("ul",null,[n("li",null,[j,e(" for devices of compute capability 5.x, 6.1, 6.2, 7.x and 8.x since for these devices, a multiprocessor issues one instruction per warp over one clock cycle for four warps at a time, as mentioned in "),n("a",T,[e("Compute Capabilities"),s(t)]),e(". "),G]),S]),F,n("p",null,[e("内核访问内存的吞吐量会因每种内存的访问模式不同而有数量级的差异。因此，最大化内存吞吐量的下一步就是根据"),n("a",O,[e("设备内存访问"),s(t)]),e("中描述的"),R,e("，尽可能优化内存访问。这种优化对全局内存访问尤为重要，因为与可用的片上带宽和算术指令吞吐量相比，全局内存带宽是较低的，因此非最佳全局内存访问通常会对性能产生很大影响。")]),V,n("p",null,[e("使用**"),X,e("**（Page-Locked Host Memory）（使用"),Z,e("、"),K,e("分配/销毁的就是锁页内存），好处（参见"),n("a",Y,[e("Page-Locked Host Memory"),s(t)]),e("）：")]),n("ul",null,[n("li",null,[e("Copies "),$,e(" with kernel execution for some devices as mentioned in "),n("a",J,[e("Asynchronous Concurrent Execution"),s(t)]),e(". "),Q]),n("li",null,[e("On some devices, "),nn,e(", eliminating the need to copy it to or from device memory as detailed in "),n("a",en,[e("Mapped Memory"),s(t)]),e(". "),n("ul",null,[n("li",null,[tn,e("，进而"),sn,e("，无需（显式地，存疑）先把数据从主机内存搬到全局存储器再访问。这既是“映射内存”（"),n("a",an,[e("Mapped Memory"),s(t)]),e("），也是**所谓的“零拷贝”（Zero-Copy）**内存。")]),on,rn])]),n("li",null,[e("On systems with a front-side bus, bandwidth between host memory and device memory is higher if host memory is allocated as page-locked and even higher if in addition it is allocated as write-combining as described in "),n("a",cn,[e("Write-Combining Memory"),s(t)]),e(". "),ln])]),pn,n("blockquote",null,[n("p",null,[dn,e("的Flag位如下（"),n("a",un,[e("参考"),s(t)]),e("）：")]),hn]),mn,n("p",null,[e("需要进行多少次事务处理，以及最终会对吞吐量造成多大影响，都因设备的计算能力而异。（"),n("a",gn,[e("Compute Capability 5.x"),s(t)]),e(", "),n("a",kn,[e("Compute Capability 6.x"),s(t)]),e(", "),n("a",_n,[e("Compute Capability 7.x"),s(t)]),e(", "),n("a",fn,[e("Compute Capability 8.x"),s(t)]),e(" and "),n("a",bn,[e("Compute Capability 9.0"),s(t)]),e(" 给出了各种计算能力如何处理全局存储器访问的更多细节。）")]),vn,n("blockquote",null,[n("p",null,[e("Ref："),n("a",yn,[e("CUDA编程：二维数组的分配和使用 - 知乎 (zhihu.com)"),s(t)])]),xn]),wn,n("p",null,[e("所以，很有必要去了解内存地址是如何映射到Bank上的。这和jurisdiction的计算能力有关。（Ref："),n("a",Cn,[e("Compute Capability 5.x"),s(t)]),e(", "),n("a",zn,[e("Compute Capability 6.x"),s(t)]),e(", "),n("a",An,[e("Compute Capability 7.x"),s(t)]),e(", "),n("a",Mn,[e("Compute Capability 8.x"),s(t)]),e(", and "),n("a",Pn,[e("Compute Capability 9.0"),s(t)]),e("）")]),n("blockquote",null,[n("p",null,[e("备注：在"),n("a",En,[e("Compute Capability 5.x"),s(t)]),e("较为详细地说明了Bank Conflict问题")])]),qn,n("ul",null,[n("li",null,[Bn,e(" this includes trading precision for speed when it does not affect the end result, such as "),n("strong",null,[e("using intrinsic instead of regular functions (intrinsic functions are listed in "),n("a",Dn,[e("Intrinsic Functions"),s(t)]),e("), single-precision instead of double-precision, or flushing denormalized numbers to zero;")]),n("ul",null,[n("li",null,[e("不要使用吞吐量低的算数指令，可以用： "),n("ul",null,[Hn,Nn,n("li",null,[e("把"),n("a",Un,[e("非规格化数"),s(t)]),e("（即十分接近0的数）直接干成0（编译参数"),Ln,e("）")])])])])]),n("li",null,[e("Minimize divergent warps caused by control flow instructions as detailed in "),n("a",In,[e("Control Flow Instructions"),s(t)]),Wn]),n("li",null,[e("Reduce the number of instructions, for example, by optimizing out synchronization points whenever possible as described in "),n("a",jn,[e("Synchronization Instruction"),s(t)]),e(" or by using restricted pointers as described in "),n("a",Tn,[Gn,s(t)]),e(". "),Sn])]),Fn,n("ul",null,[n("li",null,[e("code compiled with "),On,e(" (denormalized numbers are flushed to zero) tends to have higher performance than code compiled with "),Rn,e(". "),n("ul",null,[n("li",null,[e("把"),n("a",Vn,[e("非规格化数"),s(t)]),e("（即十分接近0的数）直接干成0")])])]),Xn])])}const Jn=o(l,[["render",Zn],["__file","chap_8_Performance_guidelines.html.vue"]]);export{Jn as default};