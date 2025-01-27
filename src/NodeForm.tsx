import React, { useState } from 'react';
import { css } from 'emotion';
import {
  Button,
  Input,
  InlineField,
  InlineFieldRow,
  InlineSwitch,
  Select,
  stylesFactory,
  ControlledCollapse,
  InlineLabel,
  ColorPicker,
  Slider,
  useTheme2,
} from '@grafana/ui';
import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { v4 as uuidv4 } from 'uuid';
import { Weathermap, Node } from 'types';
import { CiscoIcons, NetworkingIcons, DatabaseIcons, ComputerIcons } from 'iconOptions';

interface Settings {
  placeholder: string;
}

interface Props extends StandardEditorProps<Weathermap, Settings> {}

export const NodeForm = ({ value, onChange }: Props) => {
  const styles = getStyles();
  const theme = useTheme2();

  const handleChange = (e: React.FormEvent<HTMLInputElement>, i: number) => {
    let weathermap: Weathermap = value;
    if (e.currentTarget.name === 'X') {
      weathermap.nodes[i].position[0] = e.currentTarget.valueAsNumber;
    } else if (e.currentTarget.name === 'Y') {
      weathermap.nodes[i].position[1] = e.currentTarget.valueAsNumber;
    } else if (e.currentTarget.name === 'label') {
      weathermap.nodes[i].label = e.currentTarget.value;
    }
    onChange(weathermap);
  };

  const handleNodePaddingChange = (num: number, i: number, type: 'vertical' | 'horizontal') => {
    let weathermap: Weathermap = value;
    weathermap.nodes[i].padding[type] = num;
    onChange(weathermap);
  };

  const handleSpacingChange = (e: any, i: number) => {
    let weathermap: Weathermap = value;
    weathermap.nodes[i].useConstantSpacing = e.currentTarget.checked;
    onChange(weathermap);
  };

  const handleCompactChange = (e: any, i: number) => {
    let weathermap: Weathermap = value;
    weathermap.nodes[i].compactVerticalLinks = e.currentTarget.checked;
    onChange(weathermap);
  };

  const handleColorChange = (color: string, i: number, type: string) => {
    let weathermap: Weathermap = value;
    weathermap.nodes[i].colors[type as 'font' | 'background' | 'border'] = color;
    onChange(weathermap);
  };

  const applyNodeColorToAll = () => {
    let weathermap: Weathermap = value;
    for (let node of weathermap.nodes) {
      node.colors = { ...currentNode.colors };
    }
    onChange(weathermap);
  };

  const handleIconChange = (icon: string, i: number) => {
    let weathermap: Weathermap = value;

    if (icon === null) {
      weathermap.nodes[i].nodeIcon = {
        src: '',
        name: '',
        size: {
          width: 0,
          height: 0,
        },
        padding: {
          vertical: 0,
          horizontal: 0,
        },
        drawInside: false,
      };
    } else {
      weathermap.nodes[i].nodeIcon!.src = 'public/plugins/knightss27-weathermap-panel/icons/' + icon + '.svg';
      weathermap.nodes[i].nodeIcon!.name = icon;

      if (weathermap.nodes[i].nodeIcon!.size.width === 0) {
        weathermap.nodes[i].nodeIcon!.size = { width: 40, height: 40 };
      }
    }

    onChange(weathermap);
  };

  const handleIconSizeChange = (amt: number, i: number, type: 'width' | 'height') => {
    let weathermap: Weathermap = value;
    weathermap.nodes[i].nodeIcon!.size[type] = amt;
    onChange(weathermap);
  };

  const handleIconPaddingChange = (amt: number, i: number, type: 'vertical' | 'horizontal') => {
    let weathermap: Weathermap = value;
    weathermap.nodes[i].nodeIcon!.padding[type] = amt;
    onChange(weathermap);
  };

  const handleIconDrawChange = (checked: boolean, i: number) => {
    let weathermap: Weathermap = value;
    weathermap.nodes[i].nodeIcon!.drawInside = checked;
    onChange(weathermap);
  };

  const addNewNode = () => {
    let weathermap: Weathermap = value;
    const node: Node = {
      id: uuidv4(),
      position: [
        -weathermap.settings.panel.offset.x + weathermap.settings.panel.panelSize.width / 2,
        -weathermap.settings.panel.offset.y + weathermap.settings.panel.panelSize.height / 2,
      ],
      label: 'Test Label',
      anchors: {
        0: { numLinks: 0, numFilledLinks: 0 },
        1: { numLinks: 0, numFilledLinks: 0 },
        2: { numLinks: 0, numFilledLinks: 0 },
        3: { numLinks: 0, numFilledLinks: 0 },
        4: { numLinks: 0, numFilledLinks: 0 },
      },
      useConstantSpacing: false,
      compactVerticalLinks: false,
      padding: {
        vertical: 4,
        horizontal: 10,
      },
      colors:
        weathermap.nodes.length > 0
          ? weathermap.nodes[0].colors
          : {
              font: theme.colors.secondary.contrastText,
              background: theme.colors.secondary.main,
              border: theme.colors.secondary.border,
            },
      nodeIcon: {
        src: '',
        name: '',
        size: {
          width: 0,
          height: 0,
        },
        padding: {
          vertical: 0,
          horizontal: 0,
        },
        drawInside: false,
      },
    };
    weathermap.nodes.push(node);
    onChange(weathermap);
    setCurrentNode(node);
  };

  const removeNode = (i: number) => {
    let weathermap: Weathermap = value;
    weathermap.links = weathermap.links.filter((link) => {
      for (const node of link.nodes) {
        if (node.id === weathermap.nodes[i].id) {
          return false;
        }
      }
      return true;
    });
    weathermap.nodes.splice(i, 1);
    onChange(weathermap);
  };

  const clearNodes = () => {
    let weathermap: Weathermap = value;
    weathermap.nodes = [];
    weathermap.links = [];
    onChange(weathermap);
  };

  const [currentNode, setCurrentNode] = useState(value.nodes[0] ? value.nodes[0] : ('null' as unknown as Node));

  const ciscoIconsFormatted = CiscoIcons.map((t) => {
    return { label: t, value: 'cisco/' + t };
  });
  const networkingIconsFormatted = NetworkingIcons.map((t) => {
    return { label: t, value: 'networking/' + t };
  });
  const databaseIconsFormatted = DatabaseIcons.map((t) => {
    return { label: t, value: 'databases/' + t };
  });
  const computerIconsFormatted = ComputerIcons.map((t) => {
    return { label: t, value: 'computers_monitors/' + t };
  });

  return (
    <React.Fragment>
      <h6
        style={{
          padding: '10px 0px 5px 5px',
          marginTop: '10px',
          borderTop: '1px solid var(--in-content-button-background)',
        }}
      >
        Nodes
      </h6>
      <Select
        onChange={(v) => {
          setCurrentNode(v as unknown as Node);
        }}
        value={currentNode}
        options={value.nodes as unknown as Array<SelectableValue<Node>>}
        getOptionLabel={(node) => node.label}
        getOptionValue={(node) => node.id}
        className={styles.nodeSelect}
        placeholder={'Select a node'}
      ></Select>

      {value.nodes.map((node, i) => {
        if (node.id === currentNode.id) {
          return (
            <React.Fragment>
              <InlineFieldRow className={styles.inlineRow}>
                <InlineField label={'X'}>
                  <Input
                    value={node.position[0]}
                    onChange={(e) => handleChange(e, i)}
                    placeholder={'Position X'}
                    type={'number'}
                    className={styles.nodeLabel}
                    name={'X'}
                  />
                </InlineField>
                <InlineField label={'Y'}>
                  <Input
                    value={node.position[1]}
                    onChange={(e) => handleChange(e, i)}
                    placeholder={'Position Y'}
                    type={'number'}
                    className={styles.nodeLabel}
                    name={'Y'}
                  />
                </InlineField>
                <InlineField label={'Label'}>
                  <Input
                    value={node.label}
                    onChange={(e) => handleChange(e, i)}
                    placeholder={'Node Label'}
                    type={'text'}
                    className={styles.nodeLabel}
                    name={'label'}
                  />
                </InlineField>
              </InlineFieldRow>
              <InlineFieldRow className={styles.inlineRow}>
                <ControlledCollapse label="Icon">
                  <Select
                    onChange={(v) => {
                      handleIconChange(v.value!, i);
                    }}
                    value={node.nodeIcon?.name}
                    options={[
                      { label: 'Cisco Icons', value: 'cisco', options: ciscoIconsFormatted },
                      { label: 'Networking Icons', value: 'networking', options: networkingIconsFormatted },
                      { label: 'Database Icons', value: 'databases', options: databaseIconsFormatted },
                      { label: 'Computer Icons', value: 'computers_monitors', options: computerIconsFormatted },
                      { label: 'None', value: null },
                    ]}
                    className={styles.nodeSelect}
                    placeholder={'Select an icon'}
                  ></Select>
                  {/* <InlineLabel className={styles.nodeSelect}>
                    <FileUpload
                      size="sm"
                      className={styles.nodeSelect}
                      accept="image/*"
                      onFileUpload={({ currentTarget }) => {
                        if (
                          currentTarget.files &&
                          currentTarget.files[0] &&
                          currentTarget.files[0].type.startsWith('image') &&
                          currentTarget.files[0].size <= 1000000
                        ) {
                          const reader = new FileReader();
                          reader.onload = (e: any) => {
                            let weathermap: Weathermap = value;
                            weathermap.nodes[i].nodeIcon!.src = e.target.result;
                            // @ts-ignore
                            weathermap.nodes[i].nodeIcon!.name = currentTarget.files[0].name;
                            if (weathermap.nodes[i].nodeIcon!.size.width === 0) {
                              weathermap.nodes[i].nodeIcon!.size = { width: 40, height: 40 };
                            }
                            onChange(weathermap);
                          };
                          reader.readAsDataURL(currentTarget.files[0]);
                        } else {
                          handleFileUploadErrors(currentTarget.files);
                        }
                      }}
                    />
                    {node.nodeIcon?.name}
                  </InlineLabel> */}
                  <InlineFieldRow className={styles.inlineRow}>
                    <InlineField label={'Width'}>
                      <Input
                        value={node.nodeIcon!.size.width}
                        onChange={(e) => handleIconSizeChange(e.currentTarget.valueAsNumber, i, 'width')}
                        placeholder={'Width'}
                        type={'number'}
                        className={styles.nodeLabel}
                        name={'iconWidth'}
                      />
                    </InlineField>
                    <InlineField label={'Height'}>
                      <Input
                        value={node.nodeIcon!.size.height}
                        onChange={(e) => handleIconSizeChange(e.currentTarget.valueAsNumber, i, 'height')}
                        placeholder={'Height'}
                        type={'number'}
                        className={styles.nodeLabel}
                        name={'iconHeight'}
                      />
                    </InlineField>
                  </InlineFieldRow>
                  <InlineFieldRow className={styles.inlineRow}>
                    <InlineField label={'Padding Horizontal'}>
                      <Slider
                        min={0}
                        max={40}
                        value={node.nodeIcon!.padding.horizontal}
                        step={1}
                        onChange={(num) => handleIconPaddingChange(num, i, 'horizontal')}
                      />
                    </InlineField>
                    <InlineField label={'Padding Vertical'}>
                      <Slider
                        min={0}
                        max={40}
                        value={node.nodeIcon!.padding.vertical}
                        step={1}
                        onChange={(num) => handleIconPaddingChange(num, i, 'vertical')}
                      />
                    </InlineField>
                  </InlineFieldRow>
                  <InlineFieldRow className={styles.inlineRow}>
                    <InlineField label={'Draw Inside'}>
                      <InlineSwitch
                        value={node.nodeIcon!.drawInside}
                        onChange={(e) => handleIconDrawChange(e.currentTarget.checked, i)}
                      />
                    </InlineField>
                  </InlineFieldRow>
                </ControlledCollapse>
              </InlineFieldRow>
              <InlineFieldRow className={styles.inlineRow}>
                <ControlledCollapse label="Padding">
                  <InlineFieldRow className={styles.inlineRow}>
                    <InlineField label={'Horizontal'}>
                      <Slider
                        min={0}
                        max={50}
                        value={node.padding.horizontal}
                        step={1}
                        onChange={(num) => handleNodePaddingChange(num, i, 'horizontal')}
                      />
                    </InlineField>
                    <InlineField label={'Vertical'}>
                      <Slider
                        min={0}
                        max={50}
                        value={node.padding.vertical}
                        step={1}
                        onChange={(num) => handleNodePaddingChange(num, i, 'vertical')}
                      />
                    </InlineField>
                  </InlineFieldRow>
                </ControlledCollapse>
              </InlineFieldRow>
              <InlineFieldRow className={styles.inlineRow}>
                <ControlledCollapse label="Advanced">
                  <InlineFieldRow className={styles.inlineRow}>
                    <InlineField label={'Constant Spacing'}>
                      <InlineSwitch value={node.useConstantSpacing} onChange={(e) => handleSpacingChange(e, i)} />
                    </InlineField>
                    <InlineField label={'Compact Vertical Links'}>
                      <InlineSwitch value={node.compactVerticalLinks} onChange={(e) => handleCompactChange(e, i)} />
                    </InlineField>
                  </InlineFieldRow>
                </ControlledCollapse>
              </InlineFieldRow>
              <InlineFieldRow className={styles.inlineRow}>
                <ControlledCollapse label="Colors">
                  {Object.keys(node.colors).map((colorType) => (
                    <InlineFieldRow key={colorType}>
                      <InlineLabel style={{ marginBottom: '4px', textTransform: 'capitalize', flex: '1 0 auto' }}>
                        {colorType} Color:
                        <ColorPicker
                          color={node.colors[colorType as 'font' | 'background' | 'border']}
                          onChange={(e) => handleColorChange(e, i, colorType)}
                        />
                      </InlineLabel>
                    </InlineFieldRow>
                  ))}
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => applyNodeColorToAll()}
                    style={{ marginTop: '10px' }}
                  >
                    Apply to All?
                  </Button>
                </ControlledCollapse>
              </InlineFieldRow>
              <InlineFieldRow className={styles.inlineRow}>
                <Button
                  variant="destructive"
                  icon="trash-alt"
                  size="md"
                  onClick={() => removeNode(i)}
                  style={{ justifyContent: 'center' }}
                >
                  Remove Node
                </Button>
              </InlineFieldRow>
            </React.Fragment>
          );
        }
        return;
      })}

      <Button variant="secondary" icon="plus" size="md" onClick={addNewNode} className={styles.addNew}>
        Add Node
      </Button>
      <Button variant="secondary" icon="trash-alt" size="md" onClick={clearNodes} className={styles.clearAll}>
        Clear All
      </Button>
    </React.Fragment>
  );
};

const getStyles = stylesFactory(() => {
  return {
    nodeLabel: css`
      margin: 0px 0px;
    `,
    addNew: css`
      width: calc(50% - 10px);
      justify-content: center;
      margin: 10px 0px;
      margin-right: 5px;
    `,
    clearAll: css`
      width: calc(50% - 10px);
      justify-content: center;
      margin: 10px 0px;
      margin-left: 5px;
    `,
    nodeSelect: css`
      margin: 5px 0px;
    `,
    inlineField: css`
      flex: 1 0 auto;
    `,
    inlineRow: css`
      flex-flow: column;
    `,
  };
});
