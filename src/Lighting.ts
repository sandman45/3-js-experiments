
import { SpotLight, AmbientLight } from 'three';

export class Lighting {
    public spotLight: SpotLight;
    public ambientLight: AmbientLight;

    constructor() {
        this.spotLight = new SpotLight( '#fff', 1 );
        this.spotLight.castShadow = true;
        this.spotLight.shadow.mapSize.width = 1024;
        this.spotLight.shadow.mapSize.height = 1024;
        this.spotLight.position.set(0, 15, 0);


        this.ambientLight = new AmbientLight( 0x404040, 1 );
    }
	
	public update(): void {

    }
}
