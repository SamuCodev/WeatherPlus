import {
    IconSun,
    IconCloud,
    IconCloudRain,
    IconStorm,
    IconMist,
} from "@tabler/icons-react";

import "./CardPronostico.css";

export const CardPronostico = () => {
    return (
        <div className="card__pronostico">
            <div className="lun">
                <div className="lun__info">
                    <span>Lun</span>
                    <div className="lun__clima">
                        <IconCloudRain size={22} />
                        <span>Lluvioso</span>
                    </div>
                </div>
                <p className="dia__pronostico">23 °C</p>
            </div>
            <div className="mar">
                <div className="mar__info">
                    <span>Mar</span>
                    <div className="mar__clima">
                        <IconStorm size={22} />
                        <span>Tormenta</span>
                    </div>
                </div>
                <p className="dia__pronostico">23 °C</p>
            </div>
            <div className="mie">
                <div className="mie__info">
                    <span>Mie</span>
                    <div className="mie__clima">
                        <IconCloud size={22} />
                        <span>Nublado</span>
                    </div>
                </div>
                <p className="dia__pronostico">23 °C</p>
            </div>
            <div className="jue">
                <div className="jue__info">
                    <span>Jue</span>
                    <div className="jue__clima">
                        <IconCloud size={22} />
                        <span>Nublado</span>
                    </div>
                </div>
                <p className="dia__pronostico">23 °C</p>
            </div>
            <div className="vie">
                <div className="vie__info">
                    <span>Vie</span>
                    <div className="vie__clima">
                        <IconCloudRain size={22} />
                        <span>Lluvioso</span>
                    </div>
                </div>
                <p className="dia__pronostico">23 °C</p>
            </div>
        </div>
    );
};
