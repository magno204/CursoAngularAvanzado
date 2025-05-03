import { afterNextRender, Component, resource, signal } from '@angular/core';
//import { environment } from '@env/environment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
})
export default class LocationsComponent {
  $origin = signal('');

  locationResources = resource({
    request: () => ({
      origin: this.$origin(),
    }),
    loader: async ({ request }) => {
      const url = new URL(`${environment.apiUrl}/api/v1/locations`);

      if (request.origin) {
        url.searchParams.set('origin', request.origin);
      }

      const response = await fetch(url.toString());
      return response.json();
    },
  });

  constructor() {
    afterNextRender(() => {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        const origin = `${position.coords.latitude},${position.coords.longitude}`;
        this.$origin.set(origin);
      });
    });
  }
}
