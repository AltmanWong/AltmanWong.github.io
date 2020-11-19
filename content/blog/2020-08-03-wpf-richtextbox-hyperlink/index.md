---
title: 如何避免 RichTextBox Hyperlink Copy throw exception
date: "2020-08-03T13:12:03.284Z"
hashtag: WPF,技術隨筆
cover: cover.jpg
---

![如何避免 RichTextBox Hyperlink Copy throw exception](./cover.jpg)

以下有一段 `RichTextBox` 嘅 Code
```xml
<RichTextBox>
  <Paragraph>
    <Hyperlink
      Command={Binding Path=OnHyperlinkClickedCommand}
      CommandParameter="Some Parameter"
    >
      <Run Text="Click Here!">
    </Hyperlink>
  </Paragraph>
</RichTextBox>
```

就咁睇唔會有咩野大問題, 一樣可以 Click 到 highlight 到, 不過一到 Copy 個時就會 throw exception

原因係佢當個Command係個String, 而 `Command` `ToString` 係會炒粉

係要用到 Command 又要比 User Highlight & Copy 嘅情況下 我地就要用啲小聰明去解決佢。

```csharp
public static class HyperlinkBehavior
{
  public static readonly DependencyProperty CopibleCommandProperty = DependencyProperty.RegisterAttached(
    "CopibleCommand",
    typeof(ICommand),
    typeof(HyperlinkBehavior),
    new PropertyMetadata(null, OnCopibleCommandChange));

  public static void SetCopibleCommand(DependencyObject dependencyObject, ICommand value)
  {
    dependencyObject.SetValue(CopibleCommandProperty, value);
  }

  public static ICommand GetCopibleCommand(DependencyObject dependencyObject)
  {
    return (ICommand)dependencyObject.GetValue(CopibleCommandProperty);
  }

  private static void OnCopibleCommandChange(DependencyObject d, DependencyPropertyChangedEventArgs e)
  {
    try
    {
      Hyperlink link = d as Hyperlink;

      if (link != null)
      {
        link.Click -= ClickHandler;
        link.Click += ClickHandler;
      }
    }
    catch (Exception ex)
    {
      Console.WriteLine(ex);
    }
  }

  private static void ClickHandler(object sender, RoutedEventArgs e)
  {
    // Execute function here
    DependencyObject d = sender as DependencyObject;
    GetCopibleCommand(d).Execute(GetCopibleCommandParameter(d));
  }

  public static readonly DependencyProperty CopibleCommandParameterProperty = DependencyProperty.RegisterAttached(
    "CopibleCommandParameter",
    typeof(string),
    typeof(HyperlinkBehavior));

  public static void SetCopibleCommandParameter(DependencyObject dependencyObject, ICommand value)
  {
    dependencyObject.SetValue(CopibleCommandProperty, value);
  }

  public static string GetCopibleCommandParameter(DependencyObject dependencyObject)
  {
    return (string)dependencyObject.GetValue(CopibleCommandParameterProperty);
  }
}
```

冇錯就係萬能嘅 `Behavior`！上面嘅 class 有兩個 Property，分別係 `CopibleCommand` 同埋 `CopibleCommandParameter`。

`CopibleCommand` 就 Bind 番平時用開嘅 `Command`，然後就 `Listen` 著個 `Click Event`．當 User Click 中個 Hyperlink 個時就連埋個 `CopibleCommandParameter` Fire 個 `CopibleCommand` 出黎。咁就可以避咗 Copy 個時指咗去本身個 `Command` 嘅問題喇。