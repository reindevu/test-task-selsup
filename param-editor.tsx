
import React from 'react';

const params: Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'макси' },
  ],
  colors: [],
};

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  id: number;
  name: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: { [paramId: number]: string };
  colors: Color[];
  newColorName: string;
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const paramValues: { [paramId: number]: string } = {};
    props.params.forEach(param => {
      const found = props.model.paramValues.find(pv => pv.paramId === param.id);
      paramValues[param.id] = found ? found.value : "";
    });

    this.state = {
      paramValues,
      colors: props.model.colors || [],
      newColorName: "",
    };
  }

  handleParamChange = (paramId: number, value: string) => {
    this.setState(prev => ({
      paramValues: {
        ...prev.paramValues,
        [paramId]: value,
      },
    }));
  };

  handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newColorName: e.target.value });
  };

  handleAddColor = () => {
    const { newColorName, colors } = this.state;
    if (!newColorName.trim()) {
      return;
    }

    const newColor: Color = {
      id: Date.now(),
      name: newColorName.trim(),
    };

    this.setState({
      colors: [...colors, newColor],
      newColorName: "",
    });
  };

  handleDeleteColor = (id: number) => {
    this.setState(prev => ({
      colors: prev.colors.filter(c => c.id !== id),
    }));
  };

  public getModel(): Model {
    const paramValues: ParamValue[] = Object.entries(this.state.paramValues).map(
      ([paramId, value]) => ({
        paramId: Number(paramId),
        value,
      })
    );

    return {
      paramValues,
      colors: this.state.colors,
    };
  }

  render() {
    const { params } = this.props;
    const { paramValues, colors, newColorName } = this.state;

    return (
      <div>
        <h1>Редактор параметров</h1>

        <form>
          {params.map(param => (
            <div key={param.id} style={{ marginBottom: 5 }}>
              <label>
                {param.name}:
                <input
                  type="text"
                  value={paramValues[param.id] || ""}
                  onChange={e => this.handleParamChange(param.id, e.target.value)}
                  style={{ marginLeft: 5 }}
                />
              </label>
            </div>
          ))}
        </form>

        <h2>Цвета</h2>

        <div style={{display: "flex", flexDirection: "column", rowGap: 8, margin: 0, padding: 0}}>
          {colors.map(color => (
            <div key={color.id}>
              {color.name}

              <button
                onClick={() => this.handleDeleteColor(color.id)}
                style={{ marginLeft: 5 }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>

        <div style={{display: "flex", gap: 8, marginTop: colors.length === 0 ? 0 : 10}}>
          <input
            type="text"
            placeholder="Добавить цвет"
            value={newColorName}
            onChange={this.handleColorInputChange}
          />

          <button type="button" onClick={this.handleAddColor}>
            Добавить
          </button>
        </div>
      </div>
    );
  }
}


class App extends React.Component {
  editorRef = React.createRef<ParamEditor>();

  handleSave = () => {
    const model = this.editorRef.current?.getModel();
    console.log(model);
  };

  render() {
    return (
      <div>
        <ParamEditor ref={this.editorRef} params={params} model={model} />
        
        <button style={{marginTop: 10}} onClick={this.handleSave}>Сохранить</button>
      </div>
    );
  }
}

export default App;