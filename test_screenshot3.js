const { Builder, By } = require('selenium-webdriver');
const fs = require('fs');

async function takeScreenshot() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        // Obtener la fecha del mes anterior
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        // Formatear las fechas
        const startDate = `${firstDayOfMonth.getMonth() + 1}%2F01%2F${firstDayOfMonth.getFullYear()}+00%3A00+`;
        const endDate = `${lastDayOfMonth.getMonth() + 1}%2F${lastDayOfMonth.getDate()}%2F${lastDayOfMonth.getFullYear()}+00%3A00+`;

        // Construir la URL con las fechas
        const url = `http://nagiosadmin:3227@192.168.1.3/pnp4nagios/graph?host=localhost&srv=PING&start=${startDate}&end=${endDate}`;

        await driver.get(url);

        // Espera a que el elemento esté presente
        await driver.wait(
            async () => (await driver.findElements(By.css('.ui-widget'))).length > 0,
            10000,
            'Elemento .ui-widget no encontrado'
        );

        // Captura la imagen de la página completa
        const screenshot = await driver.takeScreenshot();

        // Guarda la captura de pantalla en un archivo
        const fileName = `screenshot_${firstDayOfMonth.getMonth() + 1}_${firstDayOfMonth.getFullYear()}.png`;
        fs.writeFileSync(fileName, screenshot, 'base64');
        
        console.log(`Screenshot tomada correctamente: ${fileName}`);
    } catch (error) {
        console.error('Error al tomar la screenshot:', error);
    } finally {
        await driver.quit();
    }
}

takeScreenshot();