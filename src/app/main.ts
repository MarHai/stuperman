import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { MainModule } from './main.module';

//import '../style/layout.scss';

if(process.env.ENV === 'production') {
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(MainModule);