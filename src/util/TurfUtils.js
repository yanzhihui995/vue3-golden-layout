// 引入 turf 库
import * as turf from '@turf/turf';

class TurfUtils {
  /**
   * 计算两个多边形的交集
   * @param {GeoJSON.FeatureCollection} polygon1
   * @param {GeoJSON.FeatureCollection} polygon2
   * @returns {GeoJSON.Feature|null} 交集
   */
  static intersect(polygon1, polygon2) {
    const intersection = turf.intersect(polygon1, polygon2);
    return intersection;
  }

  /**
   * 合并多个多边形
   * @param {GeoJSON.FeatureCollection[]} polygons
   * @returns {GeoJSON.FeatureCollection} 合并后的多边形
   */
  static union(polygons) {
    if (polygons.length === 0) return null;
    let union = polygons[0];
    for (let i = 1; i < polygons.length; i++) {
      union = turf.union(union, polygons[i]);
    }
    return union;
  }

  /**
   * 获取多边形的边界框
   * @param {GeoJSON.Feature} polygon
   * @returns {GeoJSON.Feature} 边界框
   */
  static bbox(polygon) {
    const bbox = turf.bbox(polygon);
    return turf.bboxPolygon(bbox);
  }

  /**
   * 检查点是否在多边形内
   * @param {GeoJSON.Point} point
   * @param {GeoJSON.Polygon} polygon
   * @returns {boolean} 点是否在多边形内
   */
  static pointInPolygon(point, polygon) {
    return turf.booleanPointInPolygon(point, polygon);
  }

  /**
   * 计算多边形的面积
   * @param {GeoJSON.Polygon} polygon
   * @returns {number} 面积
   */
  static area(polygon) {
    return turf.area(polygon);
  }

  /**
   * 计算多边形的周长
   * @param {GeoJSON.Polygon} polygon
   * @returns {number} 周长
   */
  static length(polygon) {
    return turf.length(polygon);
  }

  /**
   * 计算多边形的中心点
   * @param {GeoJSON.Polygon} polygon
   * @returns {GeoJSON.Point} 中心点
   */
  static centroid(polygon) {
    return turf.centroid(polygon);
  }
}

export default TurfUtils;