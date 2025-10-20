import os from "os";

/**
 * Obtiene la dirección IP local de la máquina.
 * Da prioridad a la IP que coincida con el prefijo de la subred deseada.
 * @param {string} [subnetPrefix="192.168.1"] - El inicio de la IP que buscas (la red de tu router principal).
 */
export default function getLocalIpAddress(subnetPrefix = "192.168.1") {
  const networkInterfaces = os.networkInterfaces();
  let firstValidIp = null; // Guardamos la primera IP como plan B

  for (const interfaceName in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceName];
    
    for (const interfaceInfo of networkInterface) {
      // Solo nos interesan IPs IPv4 que no sean internas
      if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
        
        // 1. Guardamos la primera IP válida que encontremos
        if (firstValidIp === null) {
          firstValidIp = interfaceInfo.address;
        }

        // 2. ¡Prioridad! Si esta IP es de la subred que queremos, la retornamos
        if (interfaceInfo.address.startsWith(subnetPrefix)) {
          return interfaceInfo.address;
        }
      }
    }
  }

  // 3. Si no encontramos la IP prioritaria, devolvemos la primera que encontramos.
  return firstValidIp;
}