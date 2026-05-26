# Examples

## Example 1: Product Pricing

Input:

```txt
我有一个 AI 小工具，用户增长还可以，但调用成本越来越高。我在纠结要不要继续免费冲规模，还是现在开始收费。
```

Expected branches:

- Continue free growth.
- Small paid validation.
- Narrow scope before pricing.

Expected next action:

- Do not switch the whole product to paid immediately. Invite a small group of high-frequency users into a paid test.

## Example 2: Creator Commercialization

Input:

```txt
我做了一个还没完全稳定的小产品，有人邀请我做付费分享，主题是普通人如何用 AI 改变命运。我想接，但又怕讲得太早。
```

Expected branches:

- Accept the talk.
- Delay until validation.
- Reframe into an honest build log.

Expected next action:

- Narrow the topic to what actually happened, not a universal success method.

## Example 3: Team Refactor

Input:

```txt
我们的代码越来越乱，新功能越来越慢。团队想重构，但业务还在催功能。
```

Expected branches:

- Full rewrite.
- Local repair.
- Keep shipping while tracking pain.

Expected next action:

- Identify the single boundary causing the most repeated bugs or delivery delay.
