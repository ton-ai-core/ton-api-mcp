const { TonApiCliWrapper } = require('../bin/ton-api-cli-wrapper');

async function testWrapper() {
  try {
    console.log('Инициализация TonApiCliWrapper...');
    const wrapper = new TonApiCliWrapper({ testnet: true });
    
    console.log('\nСписок доступных модулей:');
    const modules = wrapper.getApiModules();
    console.log(modules);
    
    console.log('\nМетоды модуля accounts:');
    const accountsMethods = wrapper.getModuleMethods('accounts');
    console.log(accountsMethods);
    
    console.log('\nТестовый вызов метода API:');
    try {
      const result = await wrapper.callMethod(
        'accounts', 
        'getAccount', 
        '0:10C1073837B93FDAAD594284CE8B8EFF7B9CF25427440EB2FC682762E1471365'
      );
      console.log('Результат:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Ошибка при вызове метода:', error.message);
    }
  } catch (error) {
    console.error('Ошибка в тесте:', error);
  }
}

testWrapper(); 