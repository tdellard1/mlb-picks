// https://www.fangraphs.com/guts.aspx?type=cn

export class WeightedFactors {
  // "Season","wOBA","wOBAScale","wBB","wHBP","w1B","w2B","w3B","wHR","runSB","runCS","R/PA","R/W","cFIP"
  // "2024",".311","1.236",".690",".721",".882","1.253","1.587","2.042",".200","-.408",".118","9.748","3.175"
  public static wOBA: number = 0.311; // league wOBA
  public static wOBAScale: number = 1.236;
  public static wBB: number = 0.690;
  public static wHBP: number = 0.721;
  public static w1B: number = 0.882;
  public static w2B: number = 1.253;
  public static w3B: number = 1.587;
  public static wHR: number = 2.042;
  public static RoPA: number = .118;
  public static cFIP: number = 3.175;
}