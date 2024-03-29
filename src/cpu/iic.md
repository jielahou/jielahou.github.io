---
title: IIC（I2C）总线
---

> 本文很大程度参考了：[IIC详解，包括原理、过程，最后一步步教你实现IIC_iic协议_shaguahaha的博客-CSDN博客](https://blog.csdn.net/shaguahaha/article/details/70766665)，感谢原作者的分享！（https://blog.csdn.net/shaguahaha/article/details/70766665）
>
> 原作遵循[ CC 4.0 BY-SA ](http://creativecommons.org/licenses/by-sa/4.0/)版权协议。本文同样遵守。

# 简介

IIC又称为$\mathrm{I^2C}$

1. IIC有两根数据线：数据线`SDA`、时钟线`SCL`

2. IIC上可以挂**多个**主设备、**多个**从设备

   ![iic_desc](./iic.assets/iic_desc.svg)

3. 多主机会产生**总线裁决**问题。当多个主机同时想占用总线时，企图启动总线传输数据，就叫做总线竞争。I2C通过总线仲裁，以决定让哪台主机控制总线

4. IIC总线通过上拉电阻接正电源。当**总线空闲**时，***两*根线均为高电平**。连到总线上的**任一器件输出低电平**，**都将使总线的信号变低**

5. 每个接到IIC总线上的**器件都有唯一的地址**

6. 从下图可以看到，任一器件可以拉低`SDA`或`SCL`

![iic_construct](./iic.assets/iic_construct.svg)

# 数据传送

## 数据位的有效性规定

IIC总线**进行数据传送**时，**时钟信号为高电平期间**，**数据线上的数据必须保持稳定**；只有在时钟线上的信号为低电平期间，数据线上的高电平或低电平状态才允许变化。

![iic_con](./iic.assets/iic_con-1691060540431-2.svg)

## 起始与终止信号

**`SCL`为高电平期间**：

- 起始信号：`SCL`为高电平期间，`SDA`从高到低
- 终止信号：`SCL`为高电平期间，`SDA`从低到高

> 也就是说，正常传送数据期间，当`SCL`处于高电平时，`SDA`不能变化；
>
> 但是是在传输起始、终止时，当`SCL`处于高电平时，允许`SDA`变化，并且`SDA`的变化指示着数据传输的起始与终止。

![IIC起始信号与终止信号](./iic.assets/iic_s_p.svg)

起始信号和终止信号**都是由主机发送**的。在起始信号产生之后，总线就处于被占用的状态，在终止信号产生之后，总线就处于空闲状态。

## 数据传送格式

### 字节的传送与应答

每当发送端（可能是从机，也可能是主机）**传输完一个字节的数据之后**，**发送端会等待**一段时间来**接收端的应答信号**。**接收端**通过**拉低`SDA`数据线**，给发送端发送一个应答信号，以提醒发送端：“我这边已经接受完成，数据可以继续传输！”。接下来，发送端就可以继续发送数据了。

> 传输的起始与终止信号由主机发出！
>
> 每个字节的应答信号由这个字节的接收端（可能是主机，也可能是从机）发出！

每一个字节必须保证是8位长度；数据传送时，**先传送最高位(MSB)**，每一个**被传送的字节后面都必须跟一位应答位**（即一帧共有9位）。

下图以主机发出起始信号后，传给从机的第一个字节（寻址字节）的过程做例子：

![iic_byte](./iic.assets/iic_byte.svg)

有一些特殊情况，接收端可以不做应答（做“非应答”）：

> 由于某种原因从机不对主机寻址信号应答时(如从机正在进行实时性的处理工作而无法接收总线上的数据)，它必须将数据线置于高电平，而由主机产生一个终止信号以结束总线的数据传送
>
> 如果从机对主机进行了应答，但在数据传送一段时间后无法继续接收更多的数据时，**从机可以通过对无法接收的第一个数据字节的"非应答"通知主机**，主机则应发出终止信号以结束数据的继续传送
>
> 当**主机接收数据**时，它**收到最后一个数据字节**后，必须向从机发出一个结束传送的信号：这个信号是由对从机的"**非应答**"来实现的。然后，从机释放`SDA`线，以允许主机产生终止信号

### 总线寻址

**主机在起始信号之后**，**紧接着就向总线上发送8位（1字节）数据**，用于**寻址**。这8位数据是在起始信号之后发送的第一个字节，这个字节后面的字节都是数据，不再是寻址，除非又重新来一个起始信号。

寻址字节的位定义如下：

![iic_find_byte](./iic.assets/iic_find_byte.svg)

D7~D1组成从机地址；D0是数据传送方向位，为0代表主机向从机写数据，为1代表主机由从机读数据。

主机发送地址时，**总线上的每个从机都将这7位地址码与自己的地址进行比较**，若相同，则认为自己正在被主机寻址，根据$\mathrm{R/\overline{W}}$位将自己确定为发送器或接收器。

### 数据传送

若$\mathrm{R/\overline{W}}$位为0，即主机向从机写数据，在从机向主机应答后，主机就开始发送数据。

> 注意：主机向从机发送最后一个字节时，从机可以选择应答，也可以不应答。

![iic_host_to_slave](./iic.assets/iic_host_to_slave.svg)



若$\mathrm{R/\overline{W}}$位为1，即主机由从机读数据，即从机向主机发数据的话，**从机**向主机**应答后**，接下来就会主动向主机发数据。

> 注意：从机向主机发送最后一个字节时，**主机必须不应答**！（只有这样，才能让从机释放掉`SDA`线，接下来主机才能发出终止信号）

![iic_slave_to_host](./iic.assets/iic_slave_to_host.svg)

若要在传输过程中改变数据传送的方向，起始信号和从机地址都被重复一次产生一次，但两次读/写方向位正好相反。

![iic_change](./iic.assets/iic_change.svg)