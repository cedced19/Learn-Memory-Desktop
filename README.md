# Learn Memory for Desktop

A software to learn your lesson on your computer or [other](#api).

## Installation

1. [Download](https://github.com/cedced19/learn-memory-desktop/releases/latest)
2. Extract
3. Execute `learn-memory.exe`

![Demo](demo.png)

## API

There are a Rest API on `http://localhost:7772/api/`.

You can use a [application](https://github.com/cedced19/learn-memory-mobile)  to show you your lessons on your mobile phone online and __offline__.

There are two solution to get lessons on this application:
* redirect ports on your computer and get your global ip
* be on the same wifi as your computer and get its local ip

## To compile

```
npm install
gulp dist-win
```
or
```
npm install
gulp
```
