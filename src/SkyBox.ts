import * as THREE from 'three';

export class SkyBox {
    public mesh: THREE.Mesh;

    constructor(){
        const loader = new THREE.TextureLoader();
        const cubeGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
        const cubeMaterials = [];
        const front_texture = loader.load("/space/space_ft.png");
        const back_texture = loader.load("/space/space_bk.png");
        const up_texture = loader.load("/space/space_up.png");
        const down_texture = loader.load("/space/space_dn.png");
        const right_texture = loader.load("/space/space_rt.png");
        const left_texture = loader.load("/space/space_lf.png");

        const front = new THREE.MeshBasicMaterial( { map: front_texture, side: THREE.DoubleSide });
        const back = new THREE.MeshBasicMaterial( { map: back_texture, side: THREE.DoubleSide });
        const up = new THREE.MeshBasicMaterial( { map: up_texture, side: THREE.DoubleSide });
        const down = new THREE.MeshBasicMaterial( { map: down_texture, side: THREE.DoubleSide });
        const right = new THREE.MeshBasicMaterial( { map: right_texture, side: THREE.DoubleSide });
        const left = new THREE.MeshBasicMaterial( { map: left_texture, side: THREE.DoubleSide });

        cubeMaterials.push(front);
        cubeMaterials.push(back);
        cubeMaterials.push(up);
        cubeMaterials.push(down);
        cubeMaterials.push(right);
        cubeMaterials.push(left);

        this.mesh = new THREE.Mesh(cubeGeometry, cubeMaterials);
    }
}