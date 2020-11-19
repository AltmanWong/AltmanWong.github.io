---
title: WPF RadioButton Binding 方法
date: "2020-08-06T22:12:03.284Z"
hashtag: WPF,技術隨筆
cover: cover.jpg
---

`RadioButton` 嘅 `Binding` 比平時麻煩，因為佢淨係得 `IsChecked` 呢個 `Property` 可以用到。而正常黎講 `IsChecked` 係一個 `Boolean` `Binding` 黎，即係我地需要 `Create` 翻相同數目嘅 `Boolean` 比個 `RadioButton` Bind．

```xml
<RadioButton
  Content="RadioButton 1"
  IsChecked="{Binding Path=RadioButton1, Mode=TwoWay}"
/>
<RadioButton
  Content="RadioButton 2"
  IsChecked="{Binding Path=RadioButton2, Mode=TwoWay}"
/>
```
SampleUserControl.xaml

```csharp
public SampleUserControlViewModel {
  public bool RadioButton1 { get; set; }
  public bool RadioButton2 { get; set; }
}
```
SampleUserControlViewModel.cs
### 數量多就頭很大
當 `RadioButton` 數量一多嘅時候，相對要 Create 嘅 `Boolean` 都會增多。即係 Memory 上都會用多咗，寫起上黎都會麻煩左。

要解決呢個問題，我地可以用到 `Enum` 同埋 `Converter` 去減小要用到嘅 Variable．

```csharp
public EnumEqualToTrueConverter: IValueConverter {
  public object Convert (object value, Type targetType, object parameter, System.Globalization.CultureInfo culture){
    return value.Equals(parameter);
  }
    
  public object ConvertBack (object value, Type targetType, object parameter, System.Globalization.CultureInfo culture){
    return parameter;
  }
}
```
EnumEqualToTrueConverter.cs

```xml
<RadioButton
  Content="RadioButton1"
  IsChecked="{Binding Path=SelectedRadio,
                      Converter={StaticResource EnumEqualToTrueConverter},
                      ConverterParameter={x:Static Sample:SampleEnum.RadioButton1},
                      Mode=TwoWay}"
/>

<RadioButton
  Content="RadioButton2"
  IsChecked="{Binding Path=SelectedRadio,
                      Converter={StaticResource EnumEqualToTrueConverter},
                      ConverterParameter={x:Static Sample:SampleEnum.RadioButton2},
                      Mode=TwoWay}"
/>
```
SampleUserControl.xaml

```csharp
public SampleEnum {
  RadioButton1,
  RadioButton2
}
```
SampleUserControlEnum.cs

```csharp
public SampleUserControlViewModel {
  public SampleEnum SelectedRadio { get; set; }
}
```
SampleUserControlViewModel.cs

### Converter 來回又折返人間
`Converter` 有讓神奇用途, 可以 Pass 唔同嘅 `Value` 入去然後 Return 番個唔同既 `Value` 出黎. 當 Binding Mode 設定為 `TwoWay` 嘅時候, 可以 Return 番個 `Value` 比佢 Write 番落去。

上面嗁做法就係：
1. 先 Bind 著一個 SelectedRadio, 入面裝著點著左嘅 `RadioButton`
2. 當個 Value 一變佢就會趺入個 Converter 嘅 `Convert` function, 如果係相同之下就會 Return True 比 `IsChecked`
3. 然後佢就會 Call `ConvertBack` 問番你個 True 嘅 SelectedRadio 係咩野

不過用 Converter 都會有個問題 就係係大量 Function Call 之下就會慢起來了