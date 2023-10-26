class AreaParameter {
  final String name;
  final String input;

  AreaParameter(this.name, this.input);

  Map<String, String> toJson() {
    return {
      'name': name,
      'input': input,
    };
  }
}

class AreaAction {
  final String service;
  final String name;
  final List<AreaParameter> parameters;

  AreaAction(this.service, this.name, this.parameters);

  Map<String, dynamic> toJson() {
    return {
      'service': service,
      'name': name,
      'parameters': parameters.map((param) => param.toJson()).toList(),
    };
  }
}

class Area {
  final Map<String, dynamic> trigger;
  final Map<String, dynamic> action;

  Area(this.trigger, this.action);

  Map<String, dynamic> toJson() {
    return {
      'trigger': trigger,
      'action': action,
    };
  }
}
