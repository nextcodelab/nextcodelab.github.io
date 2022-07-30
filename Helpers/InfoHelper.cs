namespace nextcodelab.github.io.Helpers
{
    public class InfoHelper
    {
        public  static DevInfo devInfo = null;
        public static async Task<DevInfo> GetDevInfoAsync()
        {
            if(devInfo!=null)
            {
                return devInfo;
            }
            var json = await DownloadStringAsync("https://raw.githubusercontent.com/nextcodelab/hosthson/main/developerInfo.json");
            if (!string.IsNullOrEmpty(json))
            {
                devInfo = Newtonsoft.Json.JsonConvert.DeserializeObject<DevInfo>(json);   
            }
            var d = devInfo;
            return devInfo;
        }
        public static async Task<string> DownloadStringAsync(string txtFileUrl)
        {
            string jsonString = null;
            try
            {
                using (HttpClient client = new HttpClient())
                using (HttpResponseMessage response = await client.GetAsync(txtFileUrl))
                using (HttpContent content = response.Content)
                {
                    jsonString = await content.ReadAsStringAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return jsonString;
        }
    }
    public class DevInfo
    {
        public string Developer { get; set; }
        public string[] Softwares { get; set; }
        public string Privacy { get; set; }
        public string Terms { get; set; }
        public string Email { get; set; }
        public string Date { get; set; }
        public string Address { get; set; }
        public string Logo { get; set; }
        public string Application { get; set; }
        public string FavIcon { get; set; }
        public string BuyCoffee { get; set; }
        public string Paypal { get; set; }
        public string Site { get; set; }
    }
    public class AppItemData
    {
        public static async Task<AppItemData> GetAppItemDataAsync()
        {
            AppItemData appItemData = null;
            var raw = "https://raw.githubusercontent.com/nextcodelab/nextcodelab.github.io/main/Helpers/Host/apps.json";
            var json = await InfoHelper.DownloadStringAsync(raw);
            if (!string.IsNullOrEmpty(json))
            {
                appItemData = Newtonsoft.Json.JsonConvert.DeserializeObject<AppItemData>(json);
            }
            return appItemData;
        }
        public string Title { get; set; }
        public List<AppItem> Items { get; set; }
    }
    public class AppItem
    {
        public string Title { get; set; }
        public string Image { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
    }
}
