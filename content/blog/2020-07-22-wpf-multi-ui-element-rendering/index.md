---
title: 大量渲染 UI Element
date: "2020-07-22T22:12:03.284Z"
hashtag: WPF,技術隨筆
cover: cover.jpg
---

![UI Element大爆炸](.\cover.jpg)

假設我哋依家有一隻咁樣嘅 `UI-Element` 叫 `SubControlUserControl`，我哋可以啪個 `Key` 同 `Value` 入去比佢 Display，從而得出下圖嘅效果。
```xml
<DockPanel Width="100" Margin="2">
    <DockPanel.Resources>
        <Style TargetType="TextBlock">
            <Setter Property="Padding" Value="2" />
            <Setter Property="Foreground" Value="White" />
        </Style>
    </DockPanel.Resources>
    <TextBlock
        DockPanel.Dock="Right" Background="SeaGreen" MinWidth="30" TextAlignment="Right"
        Text="{Binding Path=Value, RelativeSource={RelativeSource Mode=FindAncestor, AncestorType=UserControl}, StringFormat=${0:0}}"
    />
    <TextBlock
        Text="{Binding Path=Key, RelativeSource={RelativeSource Mode=FindAncestor, AncestorType=UserControl}, Mode=OneWay}"
        DockPanel.Dock="Left" Background="MediumSeaGreen"
    />
</DockPanel>
```

如果我哋想 Generate 多個以上嘅 `UI-Element` 嘅話，有以下幾個方法。

1. 直接打晒出嚟，人手啪晒啲 Key-Value 上去
2. 喺 `ViewModel` 入面 Gen 條 `List`，然後喺 xaml 入面用 `ItemsControl` Generate 翻個 `UI-Element` 出嚟
3. 直接喺 `ViewModel` 入面 Gen 個 `Panel`，然後直接啪個 `UI-Element` 入去 `Panel.Children` 入面

辦法總比困難多，但邊個方法先係最好呢？我哋實戰試一試。

以下我會用一個 `WrapPanel` 去儲著 1000 個上面嘅 `UI-Element`。

(1) 比較簡單，同時都會寫爛 Code，所以不作考慮。
```xml
<WrapPanel Orientation="Horizontal">
    <!-- Repeat this line for 1000 times -->
    <RenderTest:SubControlUserControl Key="Price" Value="1000" />
</WrapPanel> 
```

(2) 就用到 `ItemsControl` 去 `Bind` 一條有著唔同 Key-Value data 嘅 `List`，然後係ItemsControl.ItemsTemplate 入面 Call 上面嘅 `UI-Element`，再 `Bind` 埋條 `List` 入面嘅 Data。
```xml
<ItemsControl ItemsSource="{Binding Path=ListOfItemsToBeRender, Mode=OneWay}">
    <ItemsControl.ItemsPanel>
        <ItemsPanelTemplate>
            <WrapPanel Orientation="Horizontal" />
        </ItemsPanelTemplate>
    </ItemsControl.ItemsPanel>
    <ItemsControl.ItemTemplate>
        <DataTemplate>
            <RenderTest:SubControlUserControl Key="Price" Value="1000" />
        </DataTemplate>
    </ItemsControl.ItemTemplate>
</ItemsControl>
```

(3) 就直接 Call 一個 `ContentControl` `Bind` 著 `ViewModel` 入面嘅 `UI-Element`。喺 `ViewModel` 入面直接 Create 1000 隻 `SubControlUserControl`，同時啪定唔同嘅 Key-Value 入去比佢食。
```xml
<ContentControl Content="{Binding Path=ContentControl, Mode=OneWay}" />
```

```csharp
public class ViewModel {
    public ViewModel() {
        WrapPanel panel = new WrapPanel();
 
        for (int i = 0; i < 1000; i++) {
            panel.Children.Add(new SubControlUserControl("Price", 1000));
        }
 
        ContentControl = panel;
    }
 
    public UIElement ContentControl { get; set; }
}
```

以上三個方法嘅成效如下：

|運行時間 (ms)|(1) Direct Render|(2) ItemsControl|(3) ContentControl|
|---|---|---|---|
|100|38|106|47|
|1000|217|1103|260|
|10000|2656|12249|2985|

從以上嘅結果可以睇得出用 `ItemsControl` 會嚴重拖慢 Render 進程，但同時間 Direct Render 又會影響到 code readability。唯有取中庸之道係 `ViewModel` 層面預先砌好晒成個 `WrapPanel`, 再係 `xaml` 入面用 `ContentControl` 去 Call 個 `Panel` 出嚟。