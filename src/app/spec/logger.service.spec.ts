import { Logger } from "../services/logger.service";

describe("Logger", () => {
  beforeEach(() => {
    // Cria um espião na função console.log()
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    // Limpa o espião
    console.log.mockRestore();
  });

  it("should log INFO messages correctly", () => {
    const message = "Info message";

    // Chama o método infoLog()
    Logger.infoLog(message);

    // Verifica se a mensagem foi impressa corretamente
    expect(console.log).toHaveBeenCalledWith("[INFO]: " + message);
  });

  it("should log ERROR messages correctly", () => {
    const message = "Error message";

    // Chama o método errorLog()
    Logger.errorLog(message);

    // Verifica se a mensagem foi impressa corretamente
    expect(console.log).toHaveBeenCalledWith("[ERROR]: " + message);
  });

  it("should log DEBUG messages correctly", () => {
    const message = "Debug message";

    // Chama o método debugLog()
    Logger.debugLog(message);

    // Verifica se a mensagem foi impressa corretamente
    expect(console.log).toHaveBeenCalledWith("[DEBUG]: " + message);
  });

  it("should log WARN messages correctly", () => {
    const message = "Warn message";

    // Chama o método warnLog()
    Logger.warnLog(message);

    // Verifica se a mensagem foi impressa corretamente
    expect(console.log).toHaveBeenCalledWith("[WARN]: " + message);
  });

  it("should log FATAL messages correctly", () => {
    const message = "Fatal message";

    // Chama o método fatalLog()
    Logger.fatalLog(message);

    // Verifica se a mensagem foi impressa corretamente
    expect(console.log).toHaveBeenCalledWith("[FATAL]: " + message);
  });

  it("should log TRACE messages correctly", () => {
    const message = "Trace message";

    // Chama o método traceLog()
    Logger.traceLog(message);

    // Verifica se a mensagem foi impressa corretamente
    expect(console.log).toHaveBeenCalledWith("[TRACE]: " + message);
  });

  it("should log messages correctly", () => {
    const message = "Message";

    // Chama o método log()
    Logger.log(message);

    // Verifica se a mensagem foi impressa corretamente
    expect(console.log).toHaveBeenCalledWith(message);
  });
});
