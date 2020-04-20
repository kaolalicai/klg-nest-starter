---
sidebarDepth: 2
---

## 启动 e2e 测试
e2e 测试依赖 mongodb，开始之前请修改 config/test.js 里的 mongodb uri

```bash
$ npm run test
```

## 准备测试数据
在我们之前的经验，我们发现 mock mongodb db 的成本比较高，不如直接连着 mongodb 测试。

但是这种做法要求测试之前我们要准备好的基础数据，这个基础数据有个专有名词，叫 Fixtures。

在之前的开发经验中，我们会选择新建一个文件来保存 Fixtures。例如测试文件是：
`test/users/users-find.e2e-spec.ts`
则新建一个
`test/users/users-find.e2e-spec.data.ts`
里面保存每个 Model 的数据，在测试开始之前，data 会被写入 DB，测试结束的时候清理掉。

不过现在使用了 jest 测试框架，因为 jest 不会暴露运行时状态，所以无法继续使用上述方式准备 Fixtures 了，
只能在每个测试文件开头处，声明 Fixtures。

```ts
describe('AppController (e2e) find with fixtures ', () => {
  beforeAll(async function () {
    await genFixtures(UserTemplate, 10, 'User')
  })

  it('find all', () => {
    request
      .get('/users')
      .expect(200)
  })
})
```

声明 `await genFixtures(UserTemplate, 10, 'User')` 之后，数据库就会生成 10 个用户数据.

UserTemplate 长这样：
```ts
export const UserTemplate = {
  _id: () => ObjectId(),
  'name': () => Mock.Random.first(),
  phone: /1\d{10}/
}
```
这里依赖了 mockjs 帮忙把 UserTemplate 模板生成实际数据，再通过我们封装好的 genFixtures 方法把数据写入 DB 中

如果你需要生成多个表的数据，并且还需要指定数据之间的关联关系，可以参考 test/users/users-multi-db.e2e-spec.ts 这个测试的实现：

> test/users/users-multi-db.e2e-spec.ts

```ts
beforeAll(async function () {
    // 自动生成 User fixture
    let userData = await genFixtures(UserTemplate, 1, 'User')
    user = userData[0]
    userId = user._id.toString()

    // 自动生成 Account fixture，并且通过 fixData 函数来修改值
    await genFixtures(AccountTemplate, 1, 'Account', (it: any) => {
      it.userId = userId
      return it
    })
  })
```
生成 Account  的时候修改一下 UserId

## WebStorm 兼容问题
脚手架里实际存在了两套测试，所以 e2e 测试无法继续享受 WebStorm 点击快速运行测试的便利了。

![](./images/ws-run-test.png)

如果你需要这个功能, 可以把两套测试的配置位置更换一下。

- 在 package.json 中配置 e2e 测试；
- 使用独立的配置文件配置 unit test;
