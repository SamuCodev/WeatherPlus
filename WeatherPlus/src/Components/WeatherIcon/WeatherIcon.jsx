import {
    IconSun,
    IconMoon,
    IconCloud,
    IconCloudRain,
    IconCloudStorm,
    IconCloudSnow,
    IconCloudFog,
} from "@tabler/icons-react";

export const WeatherIcon = ({
    condition = "",
    iconCode = "",
    size = 28,
    stroke = 2,
    className = "",
}) => {
    const isNight = iconCode?.endsWith("n");
    const cond = (condition || "").toLowerCase();

    if (cond.includes("clear") || cond.includes("sol") || cond.includes("despejado")) {
        if (isNight) {
            return (
                <IconMoon
                    size={size}
                    stroke={stroke}
                    className={className}
                    color="#facc15"
                />
            );
        }
        return (
            <IconSun
                size={size}
                stroke={stroke}
                className={className}
                color="#f59e0b"
            />
        );
    }

    if (cond.includes("thunder") || cond.includes("tormenta")) {
        return (
            <IconCloudStorm
                size={size}
                stroke={stroke}
                className={className}
                color="#c084fc"
            />
        );
    }

    if (cond.includes("rain") || cond.includes("drizzle") || cond.includes("lluv") || cond.includes("llovizna")) {
        return (
            <IconCloudRain
                size={size}
                stroke={stroke}
                className={className}
                color="#38bdf8"
            />
        );
    }

    if (cond.includes("snow") || cond.includes("nieve")) {
        return (
            <IconCloudSnow
                size={size}
                stroke={stroke}
                className={className}
                color="#bae6fd"
            />
        );
    }

    if (
        cond.includes("mist") ||
        cond.includes("fog") ||
        cond.includes("haze") ||
        cond.includes("smoke") ||
        cond.includes("niebla") ||
        cond.includes("bruma")
    ) {
        return (
            <IconCloudFog
                size={size}
                stroke={stroke}
                className={className}
                color="#94a3b8"
            />
        );
    }

    if (cond.includes("cloud") || cond.includes("nub")) {
        return (
            <IconCloud
                size={size}
                stroke={stroke}
                className={className}
                color="#94a3b8"
            />
        );
    }

    return (
        <IconSun
            size={size}
            stroke={stroke}
            className={className}
            color="#38bdf8"
        />
    );
};
