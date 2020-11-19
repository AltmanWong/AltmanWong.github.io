---
title: 寫在WPF Binding ElementName時
date: "2020-11-09T13:28:03.284Z"
description:
hashtag: WPF,技術隨筆
cover:  cover.jpg
---
![Binding](./cover.jpg)

近排寫左個WPF Control, 入面需要用到 ElementName 去做 Source Binding

```xml
<Style x:Key="ButtonStyle" TargetType="{x:Type Button}">
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="{x:Type Button}">
                <Border BorderThickness="2" BorderBrush="{TemplateBinding BorderBrush}">
                    <TextBox x:Name="PART_TextBox" />
                </Border>
                <ControlTemplate.Triggers>
                    <DataTrigger Binding="{Binding Path=IsFocused, ElementName=PART_TextBox}" Value="True">
                        <Setter Property="BorderBrush" Value="Red" />
                    </DataTrigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
```

你會見到係 `Border` 入面有個 `TextBox`, 而我係 `DataTrigger` 入面就用 `ElementName` 去 Reference 番個 `TextBox`, 當 `TextBox.IsFocused` 既時候 `Border.BorderBrush` 就會轉為 Red

就咁睇落好似冇咩問題, 行Debug既時候都冇事. 但當我想係用 `Visibility.Collapse` 收埋佢個一刻就出事喇.

```
System.Windows.Data Error: 4 : Cannot find source for binding with reference 'ElementName=PART_TextBox'. BindingExpression:Path=IsFocused; DataItem=null; target element is 'Button' (Name=''); target property is 'NoTarget' (type 'Object')
```

如果咁寫成單野就冇事

```xml
<Style x:Key="ButtonStyle" TargetType="{x:Type Button}">
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="{x:Type Button}">
                <Border BorderThickness="2" BorderBrush="{TemplateBinding BorderBrush}">
                    <TextBox x:Name="PART_TextBox" />
                </Border>
                <ControlTemplate.Triggers>
                    <!--
                    <DataTrigger Binding="{Binding Path=IsFocused}" Value="True">
                        <Setter Property="BorderBrush" Value="Red" />
                    </DataTrigger>
                    -->
                    <Trigger Binding="{Binding Path=IsFocused}" SourceName="PART_TextBox" Value="True">
                        <Setter Property="BorderBrush" Value="Red" />
                    </Trigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
```

見到有咩唔同未? 就係由 `<DataTrigger Binding="{Binding Path=IsFocused, ElementName=PART_TextBox}"` 變成 `<Trigger Binding="{Binding Path=IsFocused}" SourceName="PART_TextBox"`

